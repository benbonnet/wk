# frozen_string_literal: true

module WorkspaceMembersService
  module Tools
    class Create < Core::Tools::Base
      route method: :post, scope: :collection
      schema "workspace_member"
      description "Add a member to workspace"

      params do
        object :data do
          string :email, required: true
          string :role, required: false
        end
      end

      def execute(user_id:, workspace_id:, data: {}, **)
        email = data[:email]&.downcase&.strip
        role = data[:role] || "editor"

        raise Core::Tools::ValidationError.new("Email is required") if email.blank?

        # Check if already a member
        existing = WorkspaceUser.joins(:user).find_by(workspace_id:, users: { email: })
        raise Core::Tools::ValidationError.new("User is already a member of this workspace") if existing

        # Find existing user
        target_user = User.find_by(email:)

        if target_user
          # Direct add - user exists
          workspace_user = WorkspaceUser.create!(
            workspace_id:,
            user_id: target_user.id,
            role:,
            status: "active"
          )
        else
          # User doesn't exist - create invite flow (pending implementation)
          # For now, raise error
          raise Core::Tools::ValidationError.new(
            "User with email '#{email}' not found. Invite functionality coming soon."
          )
        end

        { data: WorkspaceMemberSerializer.new(workspace_user).to_h, meta: { created: true } }
      end
    end
  end
end
