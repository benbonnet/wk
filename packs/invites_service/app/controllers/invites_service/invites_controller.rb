# frozen_string_literal: true

module InvitesService
  class InvitesController < ApplicationController
    # GET /invites/:auth_link_hash
    def show
      invite = Invite.find_by!(auth_link_hash: params[:auth_link_hash])

      if invite.status == "cancelled"
        render plain: "This invite has been cancelled", status: :gone
        return
      end

      # Store invite hash in session for post-auth linking
      session[:pending_invite_hash] = invite.auth_link_hash

      # Update status to clicked
      invite.update!(status: "clicked") if invite.status.in?(%w[pending sent opened])

      # Redirect to Auth0 login
      redirect_to user_auth0_omniauth_authorize_path
    end
  end
end
