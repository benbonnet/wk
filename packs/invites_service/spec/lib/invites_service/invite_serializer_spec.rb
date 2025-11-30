# frozen_string_literal: true

require "rails_helper"

RSpec.describe InvitesService::InviteSerializer do
  let(:inviter) { create(:user) }
  let(:invitee) { create(:user) }
  let(:recipient_workspace) { create(:workspace) }
  let(:item) { create(:item, schema_slug: "test", created_by: inviter, data: { "name" => "Test Item" }) }
  let(:invite) do
    create(:invite,
      inviter:,
      invitee:,
      recipient_workspace:,
      status: "pending"
    )
  end

  before do
    create(:invite_item, invite:, item:)
  end

  describe "#to_h" do
    subject(:result) { described_class.new(invite).to_h }

    it "includes id" do
      expect(result["id"]).to eq(invite.id)
    end

    it "includes inviter_id" do
      expect(result["inviter_id"]).to eq(inviter.id)
    end

    it "includes invitee_id" do
      expect(result["invitee_id"]).to eq(invitee.id)
    end

    it "includes recipient_workspace_id" do
      expect(result["recipient_workspace_id"]).to eq(recipient_workspace.id)
    end

    it "includes status" do
      expect(result["status"]).to eq("pending")
    end

    it "includes auth_link_hash" do
      expect(result["auth_link_hash"]).to eq(invite.auth_link_hash)
    end

    it "includes created_at as ISO8601" do
      expect(result["created_at"]).to eq(invite.created_at.iso8601)
    end

    it "includes updated_at as ISO8601" do
      expect(result["updated_at"]).to eq(invite.updated_at.iso8601)
    end

    it "includes item_ids" do
      expect(result["item_ids"]).to eq([item.id])
    end
  end
end
