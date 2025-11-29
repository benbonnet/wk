# frozen_string_literal: true

require "rails_helper"

RSpec.describe ActivitiesService::ActivitySerializer do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:item) { create(:item, schema_slug: "contact", workspace:, created_by: user) }
  let(:activity) do
    create(:activity,
      user:,
      workspace:,
      item:,
      activity_type: "user_action",
      category: "data_access",
      level: "info",
      message: "Created a contact",
      schema_slug: "contact",
      tool_slug: "create",
      feature_slug: "contacts",
      metadata: { ip: "127.0.0.1" },
      duration_ms: 150
    )
  end

  describe "#to_h" do
    subject(:result) { described_class.new(activity).to_h }

    it "includes id" do
      expect(result["id"]).to eq(activity.id)
    end

    it "includes workspace_id" do
      expect(result["workspace_id"]).to eq(workspace.id)
    end

    it "includes user_id" do
      expect(result["user_id"]).to eq(user.id)
    end

    it "includes activity_type" do
      expect(result["activity_type"]).to eq("user_action")
    end

    it "includes category" do
      expect(result["category"]).to eq("data_access")
    end

    it "includes level" do
      expect(result["level"]).to eq("info")
    end

    it "includes message" do
      expect(result["message"]).to eq("Created a contact")
    end

    it "includes item_id" do
      expect(result["item_id"]).to eq(item.id)
    end

    it "includes schema_slug" do
      expect(result["schema_slug"]).to eq("contact")
    end

    it "includes tool_slug" do
      expect(result["tool_slug"]).to eq("create")
    end

    it "includes feature_slug" do
      expect(result["feature_slug"]).to eq("contacts")
    end

    it "includes metadata" do
      expect(result["metadata"]).to eq("ip" => "127.0.0.1")
    end

    it "includes duration_ms" do
      expect(result["duration_ms"]).to eq(150)
    end

    it "includes created_at as ISO8601" do
      expect(result["created_at"]).to eq(activity.created_at.iso8601)
    end
  end
end
