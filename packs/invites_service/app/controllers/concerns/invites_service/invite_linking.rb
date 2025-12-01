# frozen_string_literal: true

module InvitesService
  module InviteLinking
    extend ActiveSupport::Concern

    # Call this after user authentication to link pending invite
    def link_pending_invite(user)
      return unless session[:pending_invite_hash].present?

      invite = Invite.find_by(auth_link_hash: session.delete(:pending_invite_hash))
      return unless invite
      return unless invite.invitee_email.to_s.downcase.strip == user.email.to_s.downcase.strip

      invite.link_to_user!(user)
      invite.update!(status: "confirmed")
    end
  end
end
