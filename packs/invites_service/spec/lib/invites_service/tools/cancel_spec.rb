# frozen_string_literal: true

require "rails_helper"

RSpec.describe InvitesService::Tools::Cancel do
  let(:inviter) { create(:user) }
  let(:invitee) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:item) { create(:item, workspace:, created_by: inviter) }

  describe ".execute" do
    let(:valid_params) do
      {
        user_id: inviter.id,
        workspace_id: workspace.id,
        invite_id: invite.id
      }
    end

    context "when invite is pending" do
      let(:invite) { create(:invite, workspace:, inviter:, invitee:, status: "pending", items: [item]) }

      it "cancels the invite" do
        result = described_class.execute(**valid_params)

        expect(result["status"]).to eq("cancelled")
        expect(result[:cancelled]).to be true
        expect(invite.reload.status).to eq("cancelled")
      end
    end

    context "when invite is sent" do
      let(:invite) { create(:invite, workspace:, inviter:, invitee:, status: "sent", items: [item]) }

      it "cancels the invite" do
        result = described_class.execute(**valid_params)

        expect(result["status"]).to eq("cancelled")
        expect(result[:cancelled]).to be true
      end
    end

    context "when invite is opened" do
      let(:invite) { create(:invite, workspace:, inviter:, invitee:, status: "opened", items: [item]) }

      it "cancels the invite" do
        result = described_class.execute(**valid_params)

        expect(result["status"]).to eq("cancelled")
        expect(result[:cancelled]).to be true
      end
    end

    context "when invite is clicked" do
      let(:invite) { create(:invite, workspace:, inviter:, invitee:, status: "clicked", items: [item]) }

      it "cancels the invite" do
        result = described_class.execute(**valid_params)

        expect(result["status"]).to eq("cancelled")
        expect(result[:cancelled]).to be true
      end
    end

    context "when invite is already confirmed" do
      let(:invite) { create(:invite, workspace:, inviter:, invitee:, status: "confirmed", items: [item]) }

      it "does not cancel the invite" do
        result = described_class.execute(**valid_params)

        expect(result[:cancelled]).to be false
        expect(result[:error]).to include("Cannot cancel")
        expect(invite.reload.status).to eq("confirmed")
      end
    end

    context "when invite is already cancelled" do
      let(:invite) { create(:invite, workspace:, inviter:, invitee:, status: "cancelled", items: [item]) }

      it "does not change the invite" do
        result = described_class.execute(**valid_params)

        expect(result[:cancelled]).to be false
        expect(result[:error]).to include("Cannot cancel")
      end
    end
  end
end
