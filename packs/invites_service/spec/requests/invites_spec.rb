# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Invites", type: :request do
  let(:workspace) { create(:workspace) }
  let(:inviter) { create(:user) }

  describe "GET /invites/:auth_link_hash" do
    let(:invite) do
      create(:invite,
        workspace:,
        inviter:,
        invitee_email: "john@example.com",
        status: "pending"
      )
    end

    it "stores invite hash in session and redirects to auth" do
      get "/invites/#{invite.auth_link_hash}"

      expect(response).to redirect_to(user_auth0_omniauth_authorize_path)
      expect(session[:pending_invite_hash]).to eq(invite.auth_link_hash)
    end

    it "updates invite status to clicked" do
      get "/invites/#{invite.auth_link_hash}"

      expect(invite.reload.status).to eq("clicked")
    end

    context "when invite is cancelled" do
      let(:cancelled_invite) do
        create(:invite,
          workspace:,
          inviter:,
          invitee_email: "john@example.com",
          status: "cancelled"
        )
      end

      it "returns 410 Gone" do
        get "/invites/#{cancelled_invite.auth_link_hash}"

        expect(response).to have_http_status(:gone)
      end
    end

    context "when invite not found" do
      it "returns 404" do
        get "/invites/INVALID_HASH"
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
