# frozen_string_literal: true

module InvitesService
  module Tools
    class Create < Core::Tools::Base
      description "Create an invite to share items between users"
      # No route - workflow only

      params InviteSchema

      def execute(
        user_id:,
        workspace_id:,
        inviter_id:,
        invitee_id:,
        recipient_workspace_id: nil,
        status: "pending",
        item_ids: [],
        **_
      )
        invite = nil

        ActiveRecord::Base.transaction do
          invite = Invite.create!(
            workspace_id:,
            inviter_id:,
            invitee_id:,
            recipient_workspace_id:,
            status:
          )

          item_ids.each do |item_id|
            InviteItem.create!(invite_id: invite.id, item_id:)
          end
        end

        invite.reload
        InviteSerializer.new(invite).to_h
      end
    end
  end
end
