# frozen_string_literal: true

require "rails_helper"

RSpec.describe ActivitiesService::Tools::Index do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }

  before do
    workspace.workspace_users.create!(user:, role: "admin")
  end

  describe ".execute" do
    it "returns activities for the workspace" do
      activity = Activity.create!(
        workspace:,
        user:,
        activity_type: "user_action",
        category: "data_access",
        level: "info",
        message: "Created a contact"
      )

      result = described_class.execute(
        user_id: user.id,
        workspace_id: workspace.id
      )

      expect(result[:activities].size).to eq(1)
      expect(result[:activities].first["id"]).to eq(activity.id)
      expect(result[:activities].first["message"]).to eq("Created a contact")
    end

    it "orders by created_at desc" do
      old = Activity.create!(
        workspace:,
        user:,
        activity_type: "user_action",
        category: "data_access",
        level: "info",
        message: "Old activity",
        created_at: 2.hours.ago
      )

      recent = Activity.create!(
        workspace:,
        user:,
        activity_type: "user_action",
        category: "data_access",
        level: "info",
        message: "Recent activity",
        created_at: 1.minute.ago
      )

      result = described_class.execute(
        user_id: user.id,
        workspace_id: workspace.id
      )

      expect(result[:activities].first["id"]).to eq(recent.id)
      expect(result[:activities].last["id"]).to eq(old.id)
    end

    it "respects limit parameter" do
      3.times do |i|
        Activity.create!(
          workspace:,
          user:,
          activity_type: "user_action",
          category: "data_access",
          level: "info",
          message: "Activity #{i}"
        )
      end

      result = described_class.execute(
        user_id: user.id,
        workspace_id: workspace.id,
        limit: 2
      )

      expect(result[:activities].size).to eq(2)
    end

    it "only returns activities for the specified workspace" do
      other_workspace = create(:workspace)

      Activity.create!(
        workspace:,
        user:,
        activity_type: "user_action",
        category: "data_access",
        level: "info",
        message: "My workspace activity"
      )

      Activity.create!(
        workspace: other_workspace,
        user:,
        activity_type: "user_action",
        category: "data_access",
        level: "info",
        message: "Other workspace activity"
      )

      result = described_class.execute(
        user_id: user.id,
        workspace_id: workspace.id
      )

      expect(result[:activities].size).to eq(1)
      expect(result[:activities].first["message"]).to eq("My workspace activity")
    end

    it "serializes activities with all fields" do
      Activity.create!(
        workspace:,
        user:,
        activity_type: "user_action",
        category: "data_access",
        level: "info",
        message: "Test message",
        schema_slug: "contact",
        tool_slug: "create",
        feature_slug: "contacts",
        metadata: { foo: "bar" }
      )

      result = described_class.execute(
        user_id: user.id,
        workspace_id: workspace.id
      )

      activity = result[:activities].first
      expect(activity).to include(
        "id",
        "workspace_id",
        "user_id",
        "activity_type",
        "category",
        "level",
        "message",
        "schema_slug",
        "tool_slug",
        "feature_slug",
        "created_at"
      )
      expect(activity["schema_slug"]).to eq("contact")
      expect(activity["tool_slug"]).to eq("create")
    end
  end
end
