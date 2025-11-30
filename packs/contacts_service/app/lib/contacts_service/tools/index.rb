# frozen_string_literal: true

module ContactsService
  module Tools
    class Index < Core::Tools::Base
      route method: :get, scope: :collection
      schema "contact"

      description "List all contacts with pagination and search"

      def execute(page: 1, per_page: 25, search: nil, **filters)
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

        {
          data: Core::Serializers::ItemSerializer.new(records).to_h,
          meta: {
            page: page.to_i,
            per_page: per_page.to_i,
            total:,
            total_pages: (total.to_f / per_page.to_i).ceil
          }
        }
      end

      ## TESTS ##

      rswag do
        response do
          array :data, of: "Item"
          object :meta do
            integer :page, required: true
            integer :per_page, required: true
            integer :total, required: true
            integer :total_pages, required: true
          end
        end

        example :success do
          description "List contacts with pagination"
          request page: 1, per_page: 10
          response(
            data: [
              {
                id: 1,
                schema_slug: "contact",
                workspace_id: 1,
                created_at: "2024-01-15T10:00:00Z",
                updated_at: "2024-01-15T10:00:00Z",
                data: {
                  first_name: "John",
                  last_name: "Doe",
                  email: "john@example.com"
                }
              },
              {
                id: 2,
                schema_slug: "contact",
                workspace_id: 1,
                created_at: "2024-01-16T10:00:00Z",
                updated_at: "2024-01-16T10:00:00Z",
                data: {
                  first_name: "Jane",
                  last_name: "Smith",
                  email: "jane@example.com"
                }
              }
            ],
            meta: {
              page: 1,
              per_page: 10,
              total: 42,
              total_pages: 5
            }
          )
          status 200
        end

        example :search do
          description "Search contacts by query"
          request page: 1, per_page: 10, search: "john"
          response(
            data: [
              {
                id: 1,
                schema_slug: "contact",
                workspace_id: 1,
                data: { first_name: "John", last_name: "Doe" }
              }
            ],
            meta: { page: 1, per_page: 10, total: 1, total_pages: 1 }
          )
          status 200
        end

        example :empty do
          description "No contacts found"
          request page: 1, per_page: 10, search: "nonexistent"
          response(
            data: [],
            meta: { page: 1, per_page: 10, total: 0, total_pages: 0 }
          )
          status 200
        end
      end
    end
  end
end
