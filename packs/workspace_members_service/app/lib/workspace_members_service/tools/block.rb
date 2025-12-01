# frozen_string_literal: true

module WorkspaceMembersService
  module Tools
    class Block < Core::Tools::Base
      route method: :post, scope: :member, action: :block
      schema "workspace_member"
      description "Block or unblock a member"

      params do
        integer :id, required: true
        object :data do
          boolean :blocked, required: true
        end
      end

      def execute(user_id:, workspace_id:, id:, data: {}, **)
        workspace_user = WorkspaceUser.find_by!(id:, workspace_id:)

        # Cannot block admins
        if workspace_user.role == "admin" && data[:blocked]
          raise Core::Tools::ValidationError.new("Cannot block an admin. Change their role first.")
        end

        # Cannot block yourself
        if workspace_user.user_id == user_id
          raise Core::Tools::ValidationError.new("Cannot block yourself")
        end

        new_status = data[:blocked] ? "blocked" : "active"
        workspace_user.update!(status: new_status)

        {
          data: WorkspaceMemberSerializer.new(workspace_user.reload).to_h,
          meta: { blocked: data[:blocked] }
        }
      end
    end
  end
end
