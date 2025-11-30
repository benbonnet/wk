# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::HasRelationships do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }

  # Use real contact schema
  let(:item) { create(:item, schema_slug: "contact", workspace:, created_by: user) }
  let(:child1) { create(:item, schema_slug: "contact", workspace:, created_by: user) }
  let(:child2) { create(:item, schema_slug: "contact", workspace:, created_by: user) }
  let(:spouse) { create(:item, schema_slug: "contact", workspace:, created_by: user) }

  describe "#schema_class" do
    it "returns the schema class" do
      expect(item.schema_class).to eq(ContactsService::ContactSchema)
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
