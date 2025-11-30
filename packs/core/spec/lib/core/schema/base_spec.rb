# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Schema::Base do
  describe ".title" do
    it "allows setting custom title" do
      schema = Class.new(described_class) { title "Contact" }
      expect(schema.title).to eq("Contact")
    end

    it "infers title from class name" do
      schema = Class.new(described_class)
      allow(schema).to receive(:name).and_return("ContactsService::ContactSchema")
      expect(schema.title).to eq("Contact")
    end
  end

  describe ".slug" do
    it "allows setting custom slug" do
      schema = Class.new(described_class) { slug "my-contact" }
      expect(schema.slug).to eq("my-contact")
    end

    it "infers slug from title" do
      schema = Class.new(described_class) { title "Contact Person" }
      expect(schema.slug).to eq("contact-person")
    end
  end

  describe "field helpers" do
    let(:schema) do
      Class.new(described_class) do
        title "Test"
        timestamps
        soft_delete
        slug_field :identifier
        status_field :state, values: %w[draft active archived]
      end
    end

    it { expect(schema.properties).to include(:created_at, :updated_at) }
    it { expect(schema.properties).to have_key(:deleted_at) }

    it "adds slug field with pattern" do
      expect(schema.properties[:identifier]).to include(pattern: "^[a-z0-9-]+$")
    end

    it "adds status field with enum" do
      expect(schema.properties[:state]).to include(enum: %w[draft active archived])
    end
  end

  describe ".to_full_schema" do
    let(:schema) do
      Class.new(described_class) do
        title "Contact"
        description "A contact"
        string :name

        relationships do
          has_many :addresses, schema: :address
        end

        translations(en: { name: "Name" })
      end
    end

    it "includes all schema components" do
      expect(schema.to_full_schema).to include(
        slug: "contact",
        title: "Contact",
        description: "A contact"
      )
      expect(schema.to_full_schema[:json_schema]).to be_a(Hash)
      expect(schema.to_full_schema[:relationships]).to have_attributes(length: 1)
      expect(schema.to_full_schema[:translations][:en]).to include(name: "Name")
    end
  end

  describe ".to_mock_data" do
    let(:schema) do
      Class.new(described_class) do
        title "Contact"
        string :name

        relationships do
          has_many :addresses, schema: :address, inverse: :contact
        end

        translations(en: { name: "Name" })
      end
    end

    it "formats relationships for frontend" do
      expect(schema.to_mock_data[:relationships]).to include(
        a_hash_including(name: :addresses, cardinality: :many, targetSchema: "address", inverseName: :contact)
      )
    end
  end
end
