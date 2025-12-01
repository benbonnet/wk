# frozen_string_literal: true

require "rails_helper"

RSpec.describe InvitesService::Tools::Create do
  let(:inviter) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:rib_request_item) do
    create(:item,
      schema_slug: "rib_request",
      workspace:,
      created_by: inviter,
      data: { "request_type" => "individual", "status" => "pending" }
    )
  end

  describe ".execute" do
    let(:valid_params) do
      {
        user_id: inviter.id,
        workspace_id: workspace.id,
        invitee_email: "john.doe@example.com"
      }
    end

    it "creates an invite record" do
      expect { described_class.execute(**valid_params) }
        .to change(Invite, :count).by(1)
    end

    it "does not create a user for invitee" do
      valid_params # force lazy evaluation of inviter
      expect { described_class.execute(**valid_params) }
        .not_to change(User, :count)
    end

    it "stores invitee_email on invite" do
      described_class.execute(**valid_params)

      invite = Invite.last
      expect(invite.invitee_email).to eq("john.doe@example.com")
      expect(invite.invitee_id).to be_nil
    end

    it "returns serialized invite" do
      result = described_class.execute(**valid_params)

      expect(result).to include(
        "inviter_id" => inviter.id,
        "invitee_email" => "john.doe@example.com",
        "invitee_id" => nil,
        "status" => "pending"
      )
      expect(result["id"]).to be_present
      expect(result["auth_link_hash"]).to be_present
    end

    it "normalizes email to lowercase and strips whitespace" do
      result = described_class.execute(**valid_params.merge(invitee_email: "  JOHN.DOE@EXAMPLE.COM  "))
      expect(result["invitee_email"]).to eq("john.doe@example.com")
    end

    it "defaults status to pending" do
      result = described_class.execute(**valid_params)
      expect(result["status"]).to eq("pending")
    end

    it "accepts custom status" do
      result = described_class.execute(**valid_params, status: "sent")
      expect(result["status"]).to eq("sent")
    end

    it "accepts invitee_phone" do
      result = described_class.execute(**valid_params, invitee_phone: "+33612345678")
      expect(result["invitee_phone"]).to eq("+33612345678")
    end

    it "accepts polymorphic source" do
      contact_item = create(:item, schema_slug: "contact", workspace:, created_by: inviter)

      result = described_class.execute(
        **valid_params,
        source_type: "Item",
        source_id: contact_item.id
      )

      expect(result["source_type"]).to eq("Item")
      expect(result["source_id"]).to eq(contact_item.id)
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
        described_class.execute(**valid_params, item_ids: [rib_request_item.id])
      }.to change(InviteItem, :count).by(1)
    end

    it "returns item_ids in response" do
      result = described_class.execute(**valid_params, item_ids: [rib_request_item.id])
      expect(result["item_ids"]).to eq([rib_request_item.id])
    end

    context "with invalid email" do
      it "raises validation error" do
        expect {
          described_class.execute(**valid_params.merge(invitee_email: "not-an-email"))
        }.to raise_error(ActiveRecord::RecordInvalid, /Invitee email is invalid/)
      end
    end
  end
end
