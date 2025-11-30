# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Schema::Registry do
  let(:schema_class) do
    Class.new(Core::Schema::Base) do
      def self.name
        "TestContactSchema"
      end
      title "TestContact"
    end
  end

  describe ".register" do
    it "adds schema to registry" do
      described_class.register(schema_class)
      expect(described_class.all).to include(schema_class)
    end

    it "prevents duplicates" do
      described_class.register(schema_class)
      described_class.register(schema_class)
      expect(described_class.all.count { |s| s == schema_class }).to eq(1)
    end
  end

  describe ".find" do
    before { described_class.register(schema_class) }

    it "finds schema by slug" do
      found = described_class.find("testcontact")
      expect(found).to be_present
      expect(found.slug).to eq("testcontact")
    end

    it "returns nil for unknown slug" do
      expect(described_class.find("unknown_xyz_schema")).to be_nil
    end
  end

  describe ".find!" do
    before { described_class.register(schema_class) }

    it "returns schema when found" do
      found = described_class.find!("testcontact")
      expect(found.slug).to eq("testcontact")
    end

    it "raises NotFoundError when not found" do
      expect { described_class.find!("unknown_xyz_schema") }
        .to raise_error(Core::Schema::Registry::NotFoundError)
    end
  end

  describe ".slugs" do
    before { described_class.register(schema_class) }

    it "returns all registered slugs" do
      expect(described_class.slugs).to include("testcontact")
    end
  end

  describe ".to_mock_data" do
    before { described_class.register(schema_class) }

    it "returns array of mock data for all schemas" do
      mocks = described_class.to_mock_data
      expect(mocks).to be_an(Array)
      expect(mocks.map { |m| m[:slug] }).to include("testcontact")
    end
  end
end
