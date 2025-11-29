# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Schema::Relationships do
  let(:schema_class) do
    Class.new(Core::Schema::Base) do
      relationships do
        has_one :spouse, schema: :contact, inverse: :spouse
        has_many :addresses, schema: :address, inverse: :contact
        has_many :children, schema: :contact, inverse: :parents
      end
    end
  end

  describe ".relationships" do
    it { expect(schema_class.relationships).to have_attributes(length: 3) }

    it "stores has_one relationships correctly" do
      expect(schema_class.relationships).to include(
        a_hash_including(name: :spouse, cardinality: :one, target_schema: "contact", inverse_name: :spouse)
      )
    end

    it "stores has_many relationships correctly" do
      expect(schema_class.relationships).to include(
        a_hash_including(name: :addresses, cardinality: :many, target_schema: "address", inverse_name: :contact)
      )
    end

    it "returns empty array when no relationships defined" do
      empty_class = Class.new(Core::Schema::Base)
      expect(empty_class.relationships).to eq([])
    end
  end

  describe ".has_relationship?" do
    it { expect(schema_class.has_relationship?(:spouse)).to be true }
    it { expect(schema_class.has_relationship?(:addresses)).to be true }
    it { expect(schema_class.has_relationship?(:unknown)).to be false }
  end

  describe ".find_relationship" do
    it "returns the relationship definition" do
      expect(schema_class.find_relationship(:spouse)).to include(name: :spouse, cardinality: :one)
    end

    it { expect(schema_class.find_relationship(:unknown)).to be_nil }
  end

  describe "belongs_to" do
    let(:address_schema) do
      Class.new(Core::Schema::Base) do
        relationships do
          belongs_to :contact, schema: :contact, inverse: :addresses
        end
      end
    end

    it "creates a has_one relationship" do
      expect(address_schema.find_relationship(:contact)).to include(cardinality: :one, inverse_name: :addresses)
    end
  end
end
