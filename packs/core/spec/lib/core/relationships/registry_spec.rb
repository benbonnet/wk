# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Relationships::Registry do
  let(:contact_schema) do
    Class.new(Core::Schema::Base) do
      def self.name
        "TestContactSchema"
      end
      title "TestContact"

      relationships do
        has_one :spouse, schema: :testcontact, inverse: :spouse
        has_many :addresses, schema: :testaddress, inverse: :contact
      end
    end
  end

  let(:address_schema) do
    Class.new(Core::Schema::Base) do
      def self.name
        "TestAddressSchema"
      end
      title "TestAddress"

      relationships do
        belongs_to :contact, schema: :testcontact, inverse: :addresses
      end
    end
  end

  before do
    Core::Schema::Registry.register(contact_schema)
    Core::Schema::Registry.register(address_schema)
    described_class.reload!
  end

  describe ".all" do
    it "builds registry from all schemas" do
      expect(described_class.all).to have_key("testcontact")
      expect(described_class.all).to have_key("testaddress")
    end
  end

  describe ".find" do
    it "finds relationship by schema and name" do
      rel = described_class.find("testcontact", :spouse)
      expect(rel[:cardinality]).to eq(:one)
      expect(rel[:target_schema]).to eq("testcontact")
    end

    it "returns nil for unknown relationship" do
      expect(described_class.find("testcontact", :unknown)).to be_nil
    end
  end

  describe ".inverse_of" do
    it "returns inverse relationship name" do
      expect(described_class.inverse_of("testcontact", :addresses)).to eq(:contact)
    end

    it "returns nil when no inverse defined" do
      expect(described_class.inverse_of("testcontact", :unknown)).to be_nil
    end
  end

  describe ".for_schema" do
    it "returns all relationships for schema" do
      rels = described_class.for_schema("testcontact")
      expect(rels.keys).to contain_exactly(:spouse, :addresses)
    end

    it "returns empty hash for unknown schema" do
      expect(described_class.for_schema("unknown_xyz_schema")).to eq({})
    end
  end

  describe ".valid?" do
    it "returns true for valid relationships" do
      expect(described_class.valid?(
        source_schema: "testcontact",
        target_schema: "testaddress",
        relationship_type: :addresses
      )).to be true
    end

    it "returns false for invalid target schema" do
      expect(described_class.valid?(
        source_schema: "testcontact",
        target_schema: "wrong",
        relationship_type: :addresses
      )).to be false
    end

    it "returns false for unknown relationship" do
      expect(described_class.valid?(
        source_schema: "testcontact",
        target_schema: "testaddress",
        relationship_type: :unknown
      )).to be false
    end
  end
end
