# frozen_string_literal: true

module InvitesService
  module Tools
    class Cancel < Core::Tools::Base
      description "Cancel a pending invite"
      # No route - workflow only

      params do
        string :invite_id, description: "Invite ID to cancel"
      end

      CANCELLABLE_STATUSES = %w[pending sent opened clicked].freeze

      def execute(user_id:, workspace_id:, invite_id:, **_)
        invite = scoped(Invite).find(invite_id)

        unless invite.status.in?(CANCELLABLE_STATUSES)
          return {
            id: invite.id,
            status: invite.status,
            cancelled: false,
            error: "Cannot cancel invite with status: #{invite.status}"
          }
        end

        invite.update!(status: "cancelled")

        InviteSerializer.new(invite).to_h.merge(cancelled: true)
      end
    end
  end
end
