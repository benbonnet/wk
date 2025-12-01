# frozen_string_literal: true

module WorkspaceMembersService
  module Tools
    class Destroy < Core::Tools::Base
      route method: :delete, scope: :member
      schema "workspace_member"
      description "Remove member from workspace"

      params do
        integer :id, required: true
      end

      def execute(user_id:, workspace_id:, id:, **)
        workspace_user = WorkspaceUser.find_by!(id:, workspace_id:)

        # Prevent removing self if last admin
        if workspace_user.role == "admin"
          admin_count = WorkspaceUser.where(workspace_id:, role: "admin").count
          if admin_count <= 1
            raise Core::Tools::ValidationError.new("Cannot remove the last admin from the workspace")
          end
        end

        # Prevent self-removal (optional business rule)
        if workspace_user.user_id == user_id
          raise Core::Tools::ValidationError.new("Cannot remove yourself from the workspace")
        end

        workspace_user.destroy!

        { meta: { deleted: true, id: } }
      end
    end
  end
end
