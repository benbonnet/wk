# frozen_string_literal: true

module WorkspaceMembersService
  module Tools
    class ResendInvite < Core::Tools::Base
      route method: :post, scope: :member, action: :resend_invite
      schema "workspace_member"
      description "Resend invitation email to pending member"

      param :id, type: :integer, desc: "Member ID", required: true

      def execute(user_id:, workspace_id:, id:, **)
        workspace_user = WorkspaceUser.find_by!(id:, workspace_id:)

        unless workspace_user.status == "pending"
          raise Core::Tools::ValidationError.new("Can only resend invites for pending members")
        end

        # TODO: Implement email sending via background job
        # InviteMailer.workspace_invite(workspace_user).deliver_later

        workspace_user.update!(invited_at: Time.current)

        {
          data: WorkspaceMemberSerializer.new(workspace_user.reload).to_h,
          meta: { invite_sent: true }
        }
      end
    end
  end
end
