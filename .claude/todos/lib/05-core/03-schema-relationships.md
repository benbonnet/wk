# 03 - Schema Relationships Module

## File: packs/core/app/lib/core/schema/relationships.rb

```ruby
# frozen_string_literal: true

module Core
  module Schema
    module Relationships
      extend ActiveSupport::Concern

      class_methods do
        def relationships(&block)
          if block_given?
            @relationship_builder = RelationshipBuilder.new
            @relationship_builder.instance_eval(&block)
          end
          @relationship_builder&.definitions || []
        end

        def has_relationship?(name)
          relationships.any? { |r| r[:name] == name.to_sym }
        end

        def find_relationship(name)
          relationships.find { |r| r[:name] == name.to_sym }
        end
      end

      class RelationshipBuilder
        attr_reader :definitions

        def initialize
          @definitions = []
        end

        def has_one(name, schema:, inverse: nil, description: nil, **opts)
          @definitions << {
            name: name.to_sym,
            cardinality: :one,
            target_schema: schema.to_s,
            inverse_name: inverse&.to_sym,
            description: description,
            **opts
          }
        end

        def has_many(name, schema:, inverse: nil, description: nil, **opts)
          @definitions << {
            name: name.to_sym,
            cardinality: :many,
            target_schema: schema.to_s,
            inverse_name: inverse&.to_sym,
            description: description,
            **opts
          }
        end

        def belongs_to(name, schema:, inverse: nil, description: nil, **opts)
          has_one(name, schema: schema, inverse: inverse, description: description, **opts)
        end
      end
    end
  end
end
```

## Spec: packs/core/spec/lib/core/schema/relationships_spec.rb

```ruby
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
```
