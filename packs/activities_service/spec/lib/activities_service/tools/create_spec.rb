# frozen_string_literal: true

require "rails_helper"

RSpec.describe ActivitiesService::Tools::Create do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:item) { create(:item, schema_slug: "contact", workspace:, created_by: user) }

  describe ".execute" do
    let(:valid_params) do
      {
        user_id: user.id,
        workspace_id: workspace.id,
        activity_type: "user_action",
        category: "data_access",
        level: "info",
        message: "Created a contact"
      }
    end

    it "creates an activity record" do
      expect { described_class.execute(**valid_params) }
        .to change(Activity, :count).by(1)
    end

    it "returns serialized activity" do
      result = described_class.execute(**valid_params)

      expect(result).to include(
        "activity_type" => "user_action",
        "category" => "data_access",
        "level" => "info",
        "message" => "Created a contact",
        "user_id" => user.id,
        "workspace_id" => workspace.id
      )
      expect(result["id"]).to be_present
      expect(result["created_at"]).to be_present
    end

    it "accepts optional item_id" do
      result = described_class.execute(**valid_params, item_id: item.id)

      expect(result["item_id"]).to eq(item.id)
    end

    it "accepts optional schema_slug and tool_slug" do
      result = described_class.execute(
        **valid_params,
        schema_slug: "contact",
        tool_slug: "create"
      )

      expect(result["schema_slug"]).to eq("contact")
      expect(result["tool_slug"]).to eq("create")
    end

    it "accepts optional metadata" do
      result = described_class.execute(
        **valid_params,
        metadata: { ip_address: "127.0.0.1" }
      )

      expect(result["metadata"]).to eq("ip_address" => "127.0.0.1")
    end
  end
end
