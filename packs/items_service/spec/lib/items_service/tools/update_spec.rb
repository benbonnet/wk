# frozen_string_literal: true

require "rails_helper"

RSpec.describe ItemsService::Tools::Update do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:item) do
    create(:item,
      schema_slug: "rib_request",
      workspace:,
      created_by: user,
      data: { "request_type" => "individual", "status" => "draft", "message_body" => "Original message" }
    )
  end

  describe ".execute" do
    let(:valid_params) do
      {
        user_id: other_user.id,
        workspace_id: workspace.id,
        id: item.id,
        data: { status: "pending" }
      }
    end

    it "updates the item data" do
      described_class.execute(**valid_params)

      item.reload
      expect(item.data["status"]).to eq("pending")
    end

    it "merges with existing data" do
      described_class.execute(**valid_params)

      item.reload
      expect(item.data["message_body"]).to eq("Original message")
      expect(item.data["status"]).to eq("pending")
    end

    it "sets updated_by_id" do
      described_class.execute(**valid_params)

      item.reload
      expect(item.updated_by_id).to eq(other_user.id)
    end

    it "returns serialized item" do
      result = described_class.execute(**valid_params)

      expect(result["id"]).to eq(item.id)
      expect(result["data"]).to include("status" => "pending")
    end

    it "handles multiple field updates" do
      result = described_class.execute(
        **valid_params,
        data: { status: "completed", message_body: "Updated message" }
      )

      expect(result["data"]).to include(
        "status" => "completed",
        "message_body" => "Updated message"
      )
    end

    it "raises error for non-existent item" do
      expect {
        described_class.execute(
          user_id: user.id,
          workspace_id: workspace.id,
          id: 99999,
          data: { status: "pending" }
        )
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end
end
