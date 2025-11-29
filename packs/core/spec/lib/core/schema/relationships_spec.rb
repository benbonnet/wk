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
    it "returns all defined relationships" do
      expect(schema_class.relationships.length).to eq(3)
    end

    it "stores has_one relationships correctly" do
      spouse = schema_class.relationships.find { |r| r[:name] == :spouse }
      expect(spouse[:cardinality]).to eq(:one)
      expect(spouse[:target_schema]).to eq("contact")
      expect(spouse[:inverse_name]).to eq(:spouse)
    end

    it "stores has_many relationships correctly" do
      addresses = schema_class.relationships.find { |r| r[:name] == :addresses }
      expect(addresses[:cardinality]).to eq(:many)
      expect(addresses[:target_schema]).to eq("address")
      expect(addresses[:inverse_name]).to eq(:contact)
    end

    it "returns empty array when no relationships defined" do
      empty_class = Class.new(Core::Schema::Base)
      expect(empty_class.relationships).to eq([])
    end
  end

  describe ".has_relationship?" do
    it "returns true for defined relationships" do
      expect(schema_class.has_relationship?(:spouse)).to be true
      expect(schema_class.has_relationship?(:addresses)).to be true
    end

    it "returns false for undefined relationships" do
      expect(schema_class.has_relationship?(:unknown)).to be false
    end
  end

  describe ".find_relationship" do
    it "returns the relationship definition" do
      rel = schema_class.find_relationship(:spouse)
      expect(rel[:name]).to eq(:spouse)
      expect(rel[:cardinality]).to eq(:one)
    end

    it "returns nil for undefined relationships" do
      expect(schema_class.find_relationship(:unknown)).to be_nil
    end
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
      rel = address_schema.find_relationship(:contact)
      expect(rel[:cardinality]).to eq(:one)
      expect(rel[:inverse_name]).to eq(:addresses)
    end
  end
end
