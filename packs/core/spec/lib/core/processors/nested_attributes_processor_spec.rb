# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Processors::NestedAttributesProcessor do
  let(:workspace) { create(:workspace) }
  let(:user) { create(:user) }

  describe ".strip_nested_attributes" do
    it "removes keys ending with _attributes" do
      data = {
        "first_name" => "John",
        "children_attributes" => [{ "id" => 1 }],
        "addresses_attributes" => [{ "city" => "NYC" }]
      }

      result = described_class.strip_nested_attributes(data)

      expect(result).to eq({ "first_name" => "John" })
    end
  end

  describe ".process_create" do
    let!(:parent) { create(:item, schema_slug: "contact", workspace:, created_by: user, data: { "first_name" => "Parent", "last_name" => "P" }) }
    let!(:child) { create(:item, schema_slug: "contact", workspace:, created_by: user, data: { "first_name" => "Child", "last_name" => "C" }) }

    context "linking existing item" do
      it "creates relationship" do
        data = { "children_attributes" => [{ "id" => child.id }] }

        expect {
          described_class.process_create(
            source_schema: "contact",
            source_item_id: parent.id,
            data:,
            workspace_id: workspace.id,
            user_id: user.id
          )
        }.to change(ItemRelationship, :count).by(2)

        expect(ItemRelationship.exists?(source_item_id: parent.id, target_item_id: child.id, relationship_type: "children")).to be true
        expect(ItemRelationship.exists?(source_item_id: child.id, target_item_id: parent.id, relationship_type: "parents")).to be true
      end

      it "ignores non-existent items" do
        data = { "children_attributes" => [{ "id" => 999999 }] }

        expect {
          described_class.process_create(
            source_schema: "contact",
            source_item_id: parent.id,
            data:,
            workspace_id: workspace.id,
            user_id: user.id
          )
        }.not_to change(ItemRelationship, :count)
      end
    end

    context "creating new item" do
      it "creates item and relationship" do
        data = { "children_attributes" => [{ "first_name" => "New", "last_name" => "Child" }] }

        expect {
          described_class.process_create(
            source_schema: "contact",
            source_item_id: parent.id,
            data:,
            workspace_id: workspace.id,
            user_id: user.id
          )
        }.to change(Item, :count).by(1).and change(ItemRelationship, :count).by(2)

        new_child = Item.last
        expect(new_child.data["first_name"]).to eq("New")
        expect(new_child.schema_slug).to eq("contact")
      end
    end
  end

  describe ".process_update" do
    let!(:parent) { create(:item, schema_slug: "contact", workspace:, created_by: user, data: { "first_name" => "Parent", "last_name" => "P" }) }
    let!(:child) { create(:item, schema_slug: "contact", workspace:, created_by: user, data: { "first_name" => "Child", "last_name" => "C" }) }

    before do
      ItemRelationship.create!(source_item_id: parent.id, target_item_id: child.id, relationship_type: "children")
      ItemRelationship.create!(source_item_id: child.id, target_item_id: parent.id, relationship_type: "parents")
    end

    context "_destroy flag" do
      it "removes relationship with _destroy: true" do
        data = { "children_attributes" => [{ "id" => child.id, "_destroy" => true }] }

        expect {
          described_class.process_update(
            source_schema: "contact",
            source_item_id: parent.id,
            data:,
            workspace_id: workspace.id,
            user_id: user.id
          )
        }.to change(ItemRelationship, :count).by(-2)
      end

      it "removes relationship with _destroy: '1'" do
        data = { "children_attributes" => [{ "id" => child.id, "_destroy" => "1" }] }

        expect {
          described_class.process_update(
            source_schema: "contact",
            source_item_id: parent.id,
            data:,
            workspace_id: workspace.id,
            user_id: user.id
          )
        }.to change(ItemRelationship, :count).by(-2)
      end

      it "keeps item for double-sided relationships" do
        data = { "children_attributes" => [{ "id" => child.id, "_destroy" => true }] }

        described_class.process_update(
          source_schema: "contact",
          source_item_id: parent.id,
          data:,
          workspace_id: workspace.id,
          user_id: user.id
        )

        expect(child.reload.deleted_at).to be_nil
      end
    end
  end
end
