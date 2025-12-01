# frozen_string_literal: true

module InvitesService
  module Tools
    class Create < Core::Tools::Base
      description "Create an invite"
      # No route - workflow only

      params do
        object :data, of: InviteSchema
      end

      def execute(
        user_id:,
        workspace_id:,
        invitee_email:,
        invitee_phone: nil,
        source_type: nil,
        source_id: nil,
        recipient_workspace_id: nil,
        status: "pending",
        item_ids: [],
        **_
      )
        invite = nil

        ActiveRecord::Base.transaction do
          invite = Invite.create!(
            workspace_id:,
            inviter_id: user_id,
            invitee_email: invitee_email.to_s.downcase.strip,
            invitee_phone: invitee_phone&.strip,
            source_type:,
            source_id:,
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
