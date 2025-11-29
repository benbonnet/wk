# 06 - Relationships Registry

## File: packs/core/app/lib/core/relationships/registry.rb

```ruby
# frozen_string_literal: true

module Core
  module Relationships
    class Registry
      class << self
        def all
          @all ||= build
        end

        def find(source_schema, relationship_name)
          all.dig(source_schema.to_s, relationship_name.to_sym)
        end

        def inverse_of(source_schema, relationship_name)
          find(source_schema, relationship_name)&.dig(:inverse_name)
        end

        def for_schema(schema_slug)
          all[schema_slug.to_s] || {}
        end

        def valid?(source_schema:, target_schema:, relationship_type:)
          rel = find(source_schema, relationship_type)
          rel && rel[:target_schema] == target_schema.to_s
        end

        def reload!
          @all = nil
        end

        private

        def build
          registry = {}

          Schema::Registry.all.each do |schema_class|
            source = schema_class.slug
            registry[source] ||= {}

            schema_class.relationships.each do |rel|
              registry[source][rel[:name]] = rel
            end
          end

          registry
        end
      end
    end
  end
end
```

## Spec: packs/core/spec/lib/core/relationships/registry_spec.rb

```ruby
# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Relationships::Registry do
  let(:contact_schema) do
    Class.new(Core::Schema::Base) do
      def self.name
        "ContactSchema"
      end
      title "Contact"

      relationships do
        has_one :spouse, schema: :contact, inverse: :spouse
        has_many :addresses, schema: :address, inverse: :contact
      end
    end
  end

  let(:address_schema) do
    Class.new(Core::Schema::Base) do
      def self.name
        "AddressSchema"
      end
      title "Address"

      relationships do
        belongs_to :contact, schema: :contact, inverse: :addresses
      end
    end
  end

  before do
    Core::Schema::Registry.clear!
    Core::Schema::Registry.register(contact_schema)
    Core::Schema::Registry.register(address_schema)
    described_class.reload!
  end

  describe ".all" do
    it "builds registry from all schemas" do
      expect(described_class.all).to have_key("contact")
      expect(described_class.all).to have_key("address")
    end
  end

  describe ".find" do
    it "finds relationship by schema and name" do
      rel = described_class.find("contact", :spouse)
      expect(rel[:cardinality]).to eq(:one)
      expect(rel[:target_schema]).to eq("contact")
    end

    it "returns nil for unknown relationship" do
      expect(described_class.find("contact", :unknown)).to be_nil
    end
  end

  describe ".inverse_of" do
    it "returns inverse relationship name" do
      expect(described_class.inverse_of("contact", :addresses)).to eq(:contact)
    end

    it "returns nil when no inverse defined" do
      expect(described_class.inverse_of("contact", :unknown)).to be_nil
    end
  end

  describe ".for_schema" do
    it "returns all relationships for schema" do
      rels = described_class.for_schema("contact")
      expect(rels.keys).to contain_exactly(:spouse, :addresses)
    end

    it "returns empty hash for unknown schema" do
      expect(described_class.for_schema("unknown")).to eq({})
    end
  end

  describe ".valid?" do
    it "returns true for valid relationships" do
      expect(described_class.valid?(
        source_schema: "contact",
        target_schema: "address",
        relationship_type: :addresses
      )).to be true
    end

    it "returns false for invalid target schema" do
      expect(described_class.valid?(
        source_schema: "contact",
        target_schema: "wrong",
        relationship_type: :addresses
      )).to be false
    end

    it "returns false for unknown relationship" do
      expect(described_class.valid?(
        source_schema: "contact",
        target_schema: "address",
        relationship_type: :unknown
      )).to be false
    end
  end
end
```
