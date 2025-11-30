# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::HasNestedAttributes, type: :model do
  let(:workspace) { create(:workspace) }
  let(:user) { create(:user) }

  describe "data= setter" do
    it "strips nested attributes from data" do
      item = Item.new(
        schema_slug: "contact",
        tool_slug: "create",
        workspace:,
        created_by: user,
        data: { "first_name" => "John", "last_name" => "Doe", "children_attributes" => [{ "id" => 1 }] }
      )

      expect(item.data).to eq({ "first_name" => "John", "last_name" => "Doe" })
    end

    it "stores raw data for processing" do
      item = Item.new(
        schema_slug: "contact",
        tool_slug: "create",
        workspace:,
        created_by: user,
        data: { "first_name" => "John", "last_name" => "Doe", "children_attributes" => [{ "id" => 1 }] }
      )

      expect(item._raw_data_with_nested).to include("children_attributes")
    end
  end

  describe "after_commit processing" do
    let!(:child) { create(:item, schema_slug: "contact", workspace:, created_by: user, data: { "first_name" => "Child", "last_name" => "C" }) }

    it "creates relationships on create" do
      item = Item.create!(
        schema_slug: "contact",
        tool_slug: "create",
        workspace:,
        created_by: user,
        data: { "first_name" => "Parent", "last_name" => "P", "children_attributes" => [{ "id" => child.id }] }
      )

      expect(ItemRelationship.exists?(source_item_id: item.id, target_item_id: child.id, relationship_type: "children")).to be true
    end

    it "creates relationships on update" do
      item = create(:item, schema_slug: "contact", workspace:, created_by: user, data: { "first_name" => "Parent", "last_name" => "P" })

      item.update!(data: { "first_name" => "Parent", "last_name" => "P", "children_attributes" => [{ "id" => child.id }] })

      expect(ItemRelationship.exists?(source_item_id: item.id, target_item_id: child.id, relationship_type: "children")).to be true
    end
  end
end
