# frozen_string_literal: true

module RibCheckService
  module Tools
    class Cancel < Core::Tools::Base
      description "Cancel a RIB request"
      route method: :post, scope: :member, action: "cancel"
      schema "rib_request"

      param :id, type: :integer, desc: "RIB request ID", required: true

      def execute(user_id:, workspace_id:, id:, **_)
        item = find_item!(id)

        if item.data["status"] == "completed"
          raise Core::Tools::ValidationError.new(
            "Cannot cancel completed request",
            { status: "already completed" }
          )
        end

        # 1. Update the item status
        ItemsService::Tools::Update.execute(
          user_id:,
          workspace_id:,
          id: item.id,
          data: { status: "cancelled" }
        )

        # 2. Create activity
        ActivitiesService::Tools::Create.execute(
          user_id:,
          workspace_id:,
          activity_type: "user_action",
          category: "data_access",
          level: "info",
          message: "Cancelled RIB request",
          item_id: item.id,
          schema_slug: "rib_request",
          tool_slug: "cancel",
          metadata: { item_id: item.id }
        )

        {
          data: Core::Serializers::ItemSerializer.new(item.reload).to_h,
          meta: { cancelled: true }
        }
      end
    end
  end
end
