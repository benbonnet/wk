# frozen_string_literal: true

module RibCheckService
  module Tools
    class Index < Core::Tools::Base
      description "List RIB requests"
      route method: :get, scope: :collection
      schema "rib_request"

      param :page, type: :integer, desc: "Page number", required: false
      param :per_page, type: :integer, desc: "Items per page", required: false

      def execute(user_id:, workspace_id:, page: 1, per_page: 25, **_)
        query = items.where(workspace_id:).active

        total = query.count
        records = query.order(created_at: :desc)
                       .offset((page.to_i - 1) * per_page.to_i)
                       .limit(per_page.to_i)

        {
          data: RibRequestSerializer.new(records).to_h,
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
