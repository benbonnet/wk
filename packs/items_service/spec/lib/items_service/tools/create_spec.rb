# frozen_string_literal: true

require "rails_helper"

RSpec.describe ItemsService::Tools::Create do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }

  describe ".execute" do
    let(:valid_params) do
      {
        user_id: user.id,
        workspace_id: workspace.id,
        schema_slug: "rib_request",
        tool_slug: "create",
        data: { status: "draft", message_body: "Please provide RIB" }
      }
    end

    it "creates an item record" do
      expect { described_class.execute(**valid_params) }
        .to change(Item, :count).by(1)
    end

    it "returns serialized item" do
      result = described_class.execute(**valid_params)

      expect(result["id"]).to be_present
      expect(result["schema_slug"]).to eq("rib_request")
      expect(result["data"]).to include("status" => "draft", "message_body" => "Please provide RIB")
    end

    it "sets created_by_id" do
      described_class.execute(**valid_params)

      item = Item.last
      expect(item.created_by_id).to eq(user.id)
    end

    it "sets workspace_id" do
      described_class.execute(**valid_params)

      item = Item.last
      expect(item.workspace_id).to eq(workspace.id)
    end

    it "stores schema_slug" do
      described_class.execute(**valid_params)

      item = Item.last
      expect(item.schema_slug).to eq("rib_request")
    end

    it "stores tool_slug" do
      described_class.execute(**valid_params)

      item = Item.last
      expect(item.tool_slug).to eq("create")
    end
  end
end
