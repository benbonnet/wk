# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::HasSchemaValidation, type: :model do
  let(:workspace) { create(:workspace) }
  let(:user) { create(:user) }

  describe "schema_slug validation" do
    it "fails for unknown schema_slug" do
      item = Item.new(
        schema_slug: "nonexistent",
        tool_slug: "create",
        workspace:,
        created_by: user,
        data: { "foo" => "bar" }
      )

      expect(item).not_to be_valid
      expect(item.errors[:schema_slug]).to include("is not a registered schema")
    end

    it "passes for known schema_slug" do
      item = Item.new(
        schema_slug: "contact",
        tool_slug: "create",
        workspace:,
        created_by: user,
        data: { "first_name" => "John", "last_name" => "Doe" }
      )

      expect(item).to be_valid
    end
  end

  describe "JSON Schema validation" do
    context "valid data" do
      it "passes with required fields" do
        item = Item.new(
          schema_slug: "contact",
          tool_slug: "create",
          workspace:,
          created_by: user,
          data: { "first_name" => "John", "last_name" => "Doe" }
        )

        expect(item).to be_valid
      end

      it "passes with optional fields" do
        item = Item.new(
          schema_slug: "contact",
          tool_slug: "create",
          workspace:,
          created_by: user,
          data: { "first_name" => "John", "last_name" => "Doe", "company" => "Acme Corp" }
        )

        expect(item).to be_valid
      end
    end

    context "invalid data" do
      it "fails for missing required fields" do
        item = Item.new(
          schema_slug: "contact",
          tool_slug: "create",
          workspace:,
          created_by: user,
          data: { "email" => "john@example.com" }
        )

        expect(item).not_to be_valid
        # Errors are now on flat field names, not :data
        expect(item.errors[:first_name]).to be_present
      end

      it "fails for wrong type" do
        item = Item.new(
          schema_slug: "contact",
          tool_slug: "create",
          workspace:,
          created_by: user,
          data: { "first_name" => 123, "last_name" => "Doe" }
        )

        expect(item).not_to be_valid
        # Errors are now on flat field names, not :data
        expect(item.errors[:first_name]).to be_present
      end
    end

    context "with nested attributes" do
      it "ignores nested attributes during validation" do
        item = Item.new(
          schema_slug: "contact",
          tool_slug: "create",
          workspace:,
          created_by: user,
          data: {
            "first_name" => "John",
            "last_name" => "Doe",
            "children_attributes" => [{ "id" => 999 }]
          }
        )

        expect(item).to be_valid
      end
    end
  end
end
