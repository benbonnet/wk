# frozen_string_literal: true

module ContactsService
  module Tools
    class Index < Core::Tools::Base
      route method: :get, scope: :collection
      schema "contact"

      description "List all contacts with pagination and search"

      param :page, type: :integer, desc: "Page number", required: false
      param :per_page, type: :integer, desc: "Items per page", required: false
      param :search, type: :string, desc: "Search query", required: false

      def execute(page: 1, per_page: 25, search: nil, **)
        query = items.active

        if search.present?
          query = query.where(
            "data->>'first_name' ILIKE :q OR data->>'last_name' ILIKE :q OR data->>'email' ILIKE :q",
            q: "%#{search}%"
          )
        end

        total = query.count
        records = query.order(created_at: :desc)
                       .offset((page.to_i - 1) * per_page.to_i)
                       .limit(per_page.to_i)
                       .includes(outgoing_relationships: :target_item)

        {
          data: ContactSerializer.new(records).to_h,
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
