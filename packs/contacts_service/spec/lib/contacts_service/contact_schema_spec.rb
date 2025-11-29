# frozen_string_literal: true

require "rails_helper"

RSpec.describe ContactsService::ContactSchema do
  subject(:schema_class) { described_class }

  describe "metadata" do
    it { expect(schema_class.title).to eq("Contact") }
    it { expect(schema_class.description).to eq("A contact record with personal information") }
    it { expect(schema_class.slug).to eq("contact") }
  end

  describe "fields" do
    subject(:properties) { schema_class.new.to_json_schema.dig(:schema, :properties) }

    it "has first_name" do
      expect(properties[:first_name]).to include(type: "string", maxLength: 255)
    end

    it "has last_name" do
      expect(properties[:last_name]).to include(type: "string", maxLength: 255)
    end

    it "has email with format" do
      expect(properties[:email]).to include(format: "email")
    end

    it { expect(properties).to have_key(:phone) }
    it { expect(properties).to have_key(:company) }
    it { expect(properties).to have_key(:job_title) }

    it "has gender with enum" do
      expect(properties[:gender]).to include(enum: %w[male female other prefer_not_to_say])
    end

    it "has date_of_birth with date format" do
      expect(properties[:date_of_birth]).to include(format: "date")
    end

    it "has tags as array" do
      expect(properties[:tags]).to include(type: "array")
    end

    it "has timestamps" do
      expect(properties[:created_at]).to include(format: "date-time")
      expect(properties[:updated_at]).to include(format: "date-time")
    end

    it "has soft delete" do
      expect(properties[:deleted_at]).to include(format: "date-time")
    end
  end

  describe "relationships" do
    subject(:relationships) { schema_class.relationships }

    it "has spouse relationship" do
      expect(relationships).to include(
        a_hash_including(name: :spouse, cardinality: :one, target_schema: "contact", inverse_name: :spouse)
      )
    end

    it "has addresses relationship" do
      expect(relationships).to include(
        a_hash_including(name: :addresses, cardinality: :many, target_schema: "address", inverse_name: :contact)
      )
    end

    it "has children relationship" do
      expect(relationships).to include(
        a_hash_including(name: :children, cardinality: :many, target_schema: "contact", inverse_name: :parents)
      )
    end

    it "has parents relationship" do
      expect(relationships).to include(
        a_hash_including(name: :parents, cardinality: :many, target_schema: "contact", inverse_name: :children)
      )
    end

    it "has phones relationship" do
      expect(relationships).to include(
        a_hash_including(name: :phones, cardinality: :many, target_schema: "phone", inverse_name: :contact)
      )
    end

    it "has emails relationship" do
      expect(relationships).to include(
        a_hash_including(name: :emails, cardinality: :many, target_schema: "email", inverse_name: :contact)
      )
    end

    describe "helper methods" do
      it { expect(schema_class.has_relationship?(:spouse)).to be true }
      it { expect(schema_class.has_relationship?(:addresses)).to be true }
      it { expect(schema_class.has_relationship?(:children)).to be true }
      it { expect(schema_class.has_relationship?(:nonexistent)).to be false }

      it "find_relationship returns the relationship" do
        expect(schema_class.find_relationship(:spouse)).to include(name: :spouse, cardinality: :one)
      end

      it { expect(schema_class.find_relationship(:nonexistent)).to be_nil }
    end
  end

  describe "translations" do
    subject(:translations) { schema_class.translations }

    it { expect(translations).to have_key(:en) }
    it { expect(translations).to have_key(:fr) }

    it "includes field translations in english" do
      expect(translations[:en]).to include(
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        company: "Company",
        job_title: "Job Title"
      )
    end

    it "includes relationship translations in english" do
      expect(translations[:en]).to include(spouse: "Spouse", children: "Children", addresses: "Addresses")
    end

    it "includes field translations in french" do
      expect(translations[:fr]).to include(first_name: "Prénom", last_name: "Nom", email: "Adresse e-mail")
    end

    it "includes relationship translations in french" do
      expect(translations[:fr]).to include(spouse: "Conjoint(e)", children: "Enfants", addresses: "Adresses")
    end
  end

  describe "export methods" do
    describe ".to_full_schema" do
      subject(:full_schema) { schema_class.to_full_schema }

      it { expect(full_schema).to include(slug: "contact", title: "Contact") }

      it "includes json_schema with properties" do
        expect(full_schema[:json_schema]).to match(
          a_hash_including(schema: a_hash_including(properties: a_hash_including(:first_name)))
        )
      end

      it { expect(full_schema[:relationships]).to be_an(Array).and have_attributes(size: 6) }
      it { expect(full_schema[:translations]).to include(:en, :fr) }
    end

    describe ".to_mock_data" do
      subject(:mock_data) { schema_class.to_mock_data }

      it { expect(mock_data).to include(slug: "contact") }
      it { expect(mock_data[:schema]).to be_a(Hash) }

      it "formats relationships for frontend" do
        expect(mock_data[:relationships]).to include(
          a_hash_including(name: :spouse, cardinality: :one, targetSchema: "contact", inverseName: :spouse)
        )
      end
    end
  end
end
