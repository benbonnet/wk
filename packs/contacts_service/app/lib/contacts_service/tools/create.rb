# frozen_string_literal: true

module ContactsService
  module Tools
    class Create < Core::Tools::Base
      description "Create a new contact"
      route method: :post, scope: :collection
      schema "contact"

      params do
        object :data, of: ContactSchema
      end

      def execute(user_id:, workspace_id:, data: {}, **_)
        item = Item.create!(
          schema_slug: "contact",
          tool_slug: "create",
          data:,
          created_by_id: user_id,
          updated_by_id: user_id,
          workspace_id:
        )

        { data: ContactSerializer.new(item).to_h, meta: { created: true } }
      end
    end
  end
end
