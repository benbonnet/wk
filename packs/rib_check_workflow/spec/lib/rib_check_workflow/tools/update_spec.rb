# frozen_string_literal: true

require "rails_helper"

RSpec.describe RibCheckWorkflow::Tools::Update do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:item) do
    create(:item,
      schema_slug: "rib_request",
      workspace:,
      created_by: user,
      data: { "status" => "draft", "message_body" => "Original" }
    )
  end

  describe ".workflow_id" do
    it "infers workflow ID from class name" do
      expect(described_class.workflow_id).to eq("rib_check_update")
    end
  end

  describe ".execute" do
    let(:params) do
      {
        user_id: user.id,
        workspace_id: workspace.id,
        id: item.id,
        data: {
          status: "pending",
          message_body: "Updated message"
        }
      }
    end

    it "updates the item via workflow" do
      described_class.execute(**params)

      item.reload
      expect(item.data["status"]).to eq("pending")
      expect(item.data["message_body"]).to eq("Updated message")
    end

    it "creates an activity via workflow" do
      expect { described_class.execute(**params) }.to change(Activity, :count).by(1)
    end

    it "returns serialized item with meta" do
      result = described_class.execute(**params)

      expect(result).to have_key(:data)
      expect(result).to have_key(:meta)
      expect(result[:meta][:updated]).to be true
    end

    it "raises NotFoundError for unknown item" do
      params[:id] = 99999

      expect { described_class.execute(**params) }
        .to raise_error(Core::Tools::NotFoundError)
    end
  end

  describe "routing" do
    it { expect(described_class.route_config).to include(method: :put, scope: :member) }
  end

  describe "schema" do
    it { expect(described_class.schema_slug).to eq("rib_request") }
  end
end
