# frozen_string_literal: true

module WorkspaceMembersService
  module Tools
    class Index < Core::Tools::Base
      route method: :get, scope: :collection
      schema "workspace_member"
      description "List workspace members"

      param :page, type: :integer, desc: "Page number", required: false
      param :per_page, type: :integer, desc: "Items per page", required: false
      param :search, type: :string, desc: "Search query", required: false
      param :status, type: :string, desc: "Filter by status", required: false

      def execute(workspace_id:, page: 1, per_page: 25, search: nil, status: nil, **)
        query = WorkspaceUser.where(workspace_id:).includes(:user)

        query = query.where(status:) if status.present?

        if search.present?
          query = query.joins(:user).where(
            "users.email ILIKE :q OR users.name ILIKE :q OR users.login ILIKE :q",
            q: "%#{search}%"
          )
        end

        total = query.count
        records = query.order(created_at: :desc)
                       .offset((page.to_i - 1) * per_page.to_i)
                       .limit(per_page.to_i)

        {
          data: WorkspaceMemberSerializer.new(records).to_h,
          meta: {
            page: page.to_i,
            per_page: per_page.to_i,
            total:,
            total_pages: (total.to_f / per_page.to_i).ceil
          }
        }
      end
    end
  end
end
