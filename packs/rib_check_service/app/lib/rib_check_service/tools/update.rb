# frozen_string_literal: true

module RibCheckService
  module Tools
    class Update < Core::Tools::Base
      description "Update a RIB request"
      route method: :put, scope: :member
      schema "rib_request"

      params do
        integer :id, required: true
        object :data, of: RibRequestSchema
      end

      def execute(user_id:, workspace_id:, id:, data: {}, **_)
        item = find_item!(id)

        # 1. Update the item
        ItemsService::Tools::Update.execute(
          user_id:,
          workspace_id:,
          id: item.id,
          data:
        )

        # 2. Create activity
        ActivitiesService::Tools::Create.execute(
          user_id:,
          workspace_id:,
          activity_type: "user_action",
          category: "data_access",
          level: "info",
          message: "Updated RIB request",
          item_id: item.id,
          schema_slug: "rib_request",
          tool_slug: "update",
          metadata: { changes: data }
        )

        {
          data: RibRequestSerializer.new(item.reload).to_h,
          meta: { updated: true }
        }
      end
    end
  end
end
