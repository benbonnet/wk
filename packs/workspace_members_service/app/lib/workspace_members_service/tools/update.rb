# frozen_string_literal: true

module WorkspaceMembersService
  module Tools
    class Update < Core::Tools::Base
      route method: :put, scope: :member
      schema "workspace_member"
      description "Update member role"

      param :id, type: :integer, desc: "Member ID", required: true

      params do
        object :data do
          string :role, required: true
        end
      end

      def execute(user_id:, workspace_id:, id:, data: {}, **)
        workspace_user = WorkspaceUser.find_by!(id:, workspace_id:)

        role = data[:role]
        unless WorkspaceUser::ROLES.include?(role)
          raise Core::Tools::ValidationError.new("Invalid role. Must be one of: #{WorkspaceUser::ROLES.join(', ')}")
        end

        # Prevent demoting the last admin
        if workspace_user.role == "admin" && role != "admin"
          admin_count = WorkspaceUser.where(workspace_id:, role: "admin").count
          if admin_count <= 1
            raise Core::Tools::ValidationError.new("Cannot change role of the last admin")
          end
        end

        workspace_user.update!(role:)

        { data: WorkspaceMemberSerializer.new(workspace_user.reload).to_h, meta: { updated: true } }
      end
    end
  end
end
