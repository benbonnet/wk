# frozen_string_literal: true

require "rails_helper"

RSpec.describe InvitesService::InviteLinking do
  let(:test_class) do
    Class.new do
      include InvitesService::InviteLinking

      attr_accessor :session_store

      def session
        @session_store ||= {}
      end
    end
  end

  let(:instance) { test_class.new }
  let(:workspace) { create(:workspace) }
  let(:inviter) { create(:user) }

  describe "#link_pending_invite" do
    let(:user) { create(:user, email: "john@example.com") }
    let(:invite) do
      create(:invite,
        workspace:,
        inviter:,
        invitee_email: "john@example.com",
        status: "clicked"
      )
    end

    context "with matching pending invite in session" do
      before do
        instance.session[:pending_invite_hash] = invite.auth_link_hash
      end

      it "links invite to user" do
        instance.link_pending_invite(user)
        expect(invite.reload.invitee).to eq(user)
      end

      it "updates invite status to confirmed" do
        instance.link_pending_invite(user)
        expect(invite.reload.status).to eq("confirmed")
      end

      it "clears session" do
        instance.link_pending_invite(user)
        expect(instance.session[:pending_invite_hash]).to be_nil
      end
    end

    context "when email does not match" do
      let(:other_user) { create(:user, email: "other@example.com") }

      before do
        instance.session[:pending_invite_hash] = invite.auth_link_hash
      end

      it "does not link invite" do
        instance.link_pending_invite(other_user)
        expect(invite.reload.invitee).to be_nil
      end

      it "clears session anyway" do
        instance.link_pending_invite(other_user)
        expect(instance.session[:pending_invite_hash]).to be_nil
      end
    end

    context "when no pending invite in session" do
      it "does nothing" do
        expect { instance.link_pending_invite(user) }.not_to raise_error
      end
    end
  end
end
