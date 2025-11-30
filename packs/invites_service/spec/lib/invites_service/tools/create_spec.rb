# frozen_string_literal: true

require "rails_helper"

RSpec.describe InvitesService::Tools::Create do
  let(:inviter) { create(:user) }
  let(:invitee) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:item) { create(:item, schema_slug: "test", workspace:, created_by: inviter, data: { "name" => "Test Item" }) }

  describe ".execute" do
    let(:valid_params) do
      {
        user_id: inviter.id,
        workspace_id: workspace.id,
        inviter_id: inviter.id,
        invitee_id: invitee.id
      }
    end

    it "creates an invite record" do
      expect { described_class.execute(**valid_params) }
        .to change(Invite, :count).by(1)
    end

    it "returns serialized invite" do
      result = described_class.execute(**valid_params)

      expect(result).to include(
        "inviter_id" => inviter.id,
        "invitee_id" => invitee.id,
        "status" => "pending"
      )
      expect(result["id"]).to be_present
      expect(result["auth_link_hash"]).to be_present
      expect(result["created_at"]).to be_present
    end

    it "defaults status to pending" do
      result = described_class.execute(**valid_params)

      expect(result["status"]).to eq("pending")
    end

    it "accepts custom status" do
      result = described_class.execute(**valid_params, status: "sent")

      expect(result["status"]).to eq("sent")
    end

    it "accepts recipient_workspace_id" do
      recipient_workspace = create(:workspace)
      result = described_class.execute(
        **valid_params,
        recipient_workspace_id: recipient_workspace.id
      )

      expect(result["recipient_workspace_id"]).to eq(recipient_workspace.id)
    end

    it "creates invite_items for provided item_ids" do
      expect {
        described_class.execute(**valid_params, item_ids: [item.id])
      }.to change(InviteItem, :count).by(1)
    end

    it "returns item_ids in response" do
      result = described_class.execute(**valid_params, item_ids: [item.id])

      expect(result["item_ids"]).to eq([item.id])
    end

    it "handles multiple item_ids" do
      item2 = create(:item, schema_slug: "test", workspace:, created_by: inviter, data: { "name" => "Test Item 2" })

      result = described_class.execute(**valid_params, item_ids: [item.id, item2.id])

      expect(result["item_ids"]).to contain_exactly(item.id, item2.id)
    end
  end
end
