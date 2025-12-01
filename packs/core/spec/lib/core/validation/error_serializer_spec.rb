# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Validation::ErrorSerializer do
  describe ".call" do
    let(:user) { create(:user) }
    let(:workspace) { create(:workspace) }

    context "with Item model (JSON Schema validation)" do
      it "serializes missing required fields" do
        item = build(:item,
          workspace:,
          schema_slug: "contact",
          tool_slug: "create",
          data: { "company" => "Acme" },
          created_by: user
        )
        item.valid?

        result = described_class.call(item)

        expect(result).to have_key("first_name")
        expect(result["first_name"]).to include("can't be blank")
        expect(result).to have_key("last_name")
        expect(result["last_name"]).to include("can't be blank")
      end

      it "serializes enum validation errors" do
        item = build(:item,
          workspace:,
          schema_slug: "contact",
          tool_slug: "create",
          data: { "first_name" => "John", "last_name" => "Doe", "gender" => "invalid" },
          created_by: user
        )
        item.valid?

        result = described_class.call(item)

        expect(result).to have_key("gender")
        expect(result["gender"]).to include("is not included in the list")
      end
    end

    context "with standard Rails model" do
      it "serializes ActiveRecord validation errors" do
        user = User.new(login: nil, auth0_id: nil)
        user.valid?

        result = described_class.call(user)

        expect(result).to have_key("login")
        expect(result).to have_key("auth0_id")
      end
    end

    context "with valid record" do
      it "returns empty hash" do
        item = build(:item,
          workspace:,
          schema_slug: "contact",
          tool_slug: "create",
          data: { "first_name" => "John", "last_name" => "Doe" },
          created_by: user
        )
        item.valid?

        result = described_class.call(item)

        # Should not have first_name/last_name errors
        expect(result["first_name"]).to be_nil
        expect(result["last_name"]).to be_nil
      end
    end
  end
end
