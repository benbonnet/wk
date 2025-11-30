# 11 - HasRelationships Model Concern

## File: packs/core/app/models/concerns/core/has_relationships.rb

```ruby
# frozen_string_literal: true

module Core
  module HasRelationships
    extend ActiveSupport::Concern

    included do
      has_many :outgoing_relationships,
               class_name: "ItemRelationship",
               foreign_key: :source_item_id,
               dependent: :destroy,
               inverse_of: :source_item

      has_many :incoming_relationships,
               class_name: "ItemRelationship",
               foreign_key: :target_item_id,
               dependent: :destroy,
               inverse_of: :target_item

      has_many :related_items,
               through: :outgoing_relationships,
               source: :target_item

      has_many :inverse_related_items,
               through: :incoming_relationships,
               source: :source_item
    end

    def schema_class
      @schema_class ||= Schema::Registry.find(schema_slug)
    end

    def relationships_of_type(type)
      outgoing_relationships
        .where(relationship_type: type.to_s)
        .includes(:target_item)
    end

    def related_of_type(type)
      relationships_of_type(type).map(&:target_item)
    end

    def load_relationships
      return {} unless schema_class

      schema_class.relationships.each_with_object({}) do |rel, acc|
        items = related_of_type(rel[:name])
        acc[rel[:name].to_s] = rel[:cardinality] == :one ? items.first : items
      end
    end

    def add_relationship(target, type, metadata: {})
      Relationships::Service.create(
        source_item: self,
        target_item: target,
        relationship_type: type,
        metadata: metadata
      )
    end

    def remove_relationship(target, type)
      Relationships::Service.destroy(
        source_item: self,
        target_item: target,
        relationship_type: type
      )
    end
  end
end
```

## Usage in Item Model

Add to `app/models/item.rb`:

```ruby
class Item < ApplicationRecord
  include Core::HasRelationships

  # ... existing code
end
```

## Spec: packs/core/spec/models/concerns/core/has_relationships_spec.rb

```ruby
# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::HasRelationships do
  let(:contact_schema) do
    Class.new(Core::Schema::Base) do
      def self.name
        "ContactSchema"
      end
      title "Contact"

      relationships do
        has_many :children, schema: :contact, inverse: :parents
        has_many :parents, schema: :contact, inverse: :children
        has_one :spouse, schema: :contact, inverse: :spouse
      end
    end
  end

  let(:user) { create(:user) }
  let(:item) { create(:item, schema_slug: "contact", created_by: user) }
  let(:child1) { create(:item, schema_slug: "contact", created_by: user) }
  let(:child2) { create(:item, schema_slug: "contact", created_by: user) }
  let(:spouse) { create(:item, schema_slug: "contact", created_by: user) }

  before do
    Core::Schema::Registry.clear!
    Core::Schema::Registry.register(contact_schema)
    Core::Relationships::Registry.reload!

    # Include the concern in Item for testing
    Item.include(Core::HasRelationships) unless Item.included_modules.include?(Core::HasRelationships)
  end

  describe "#schema_class" do
    it "returns the schema class" do
      expect(item.schema_class).to eq(contact_schema)
    end
  end

  describe "#add_relationship" do
    it "creates a relationship" do
      expect { item.add_relationship(child1, :children) }
        .to change(ItemRelationship, :count).by(2) # forward + inverse
    end

    it "creates relationship with metadata" do
      item.add_relationship(child1, :children, metadata: { role: "primary" })

      rel = ItemRelationship.find_by(source_item: item, target_item: child1)
      expect(rel.metadata).to eq({ "role" => "primary" })
    end
  end

  describe "#remove_relationship" do
    before do
      item.add_relationship(child1, :children)
    end

    it "destroys the relationship" do
      expect { item.remove_relationship(child1, :children) }
        .to change(ItemRelationship, :count).by(-2)
    end
  end

  describe "#relationships_of_type" do
    before do
      item.add_relationship(child1, :children)
      item.add_relationship(child2, :children)
    end

    it "returns relationships of given type" do
      rels = item.relationships_of_type(:children)
      expect(rels.count).to eq(2)
    end
  end

  describe "#related_of_type" do
    before do
      item.add_relationship(child1, :children)
      item.add_relationship(child2, :children)
    end

    it "returns related items" do
      related = item.related_of_type(:children)
      expect(related).to contain_exactly(child1, child2)
    end
  end

  describe "#load_relationships" do
    before do
      item.add_relationship(child1, :children)
      item.add_relationship(child2, :children)
      item.add_relationship(spouse, :spouse)
    end

    it "loads all relationships based on schema" do
      rels = item.load_relationships

      expect(rels["children"]).to contain_exactly(child1, child2)
      expect(rels["spouse"]).to eq(spouse)
      expect(rels["parents"]).to eq([])
    end

    it "returns single item for has_one" do
      rels = item.load_relationships
      expect(rels["spouse"]).to be_a(Item)
    end

    it "returns array for has_many" do
      rels = item.load_relationships
      expect(rels["children"]).to be_an(Array)
    end
  end

  describe "associations" do
    before do
      item.add_relationship(child1, :children)
    end

    it "provides outgoing_relationships" do
      expect(item.outgoing_relationships.count).to eq(1)
    end

    it "provides incoming_relationships for inverse" do
      expect(child1.incoming_relationships.count).to eq(1)
    end

    it "provides related_items through association" do
      expect(item.related_items).to include(child1)
    end

    it "provides inverse_related_items through association" do
      expect(child1.inverse_related_items).to include(item)
    end
  end
end
```
