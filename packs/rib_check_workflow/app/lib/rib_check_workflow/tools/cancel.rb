# frozen_string_literal: true

module RibCheckWorkflow
  module Tools
    class Cancel < Core::Workflow::Base
      description "Cancel a RIB request"
      route method: :post, scope: :member, action: "cancel"
      schema "rib_request"

      param :id, type: :integer, desc: "RIB request ID", required: true

      # Inferred workflow_id: rib_check_cancel

      def execute(user_id:, workspace_id:, id:, **_)
        item = find_item!(id)

        if item.data["status"] == "completed"
          raise Core::Tools::ValidationError.new(
            "Cannot cancel completed request",
            { status: "already completed" }
          )
        end

        result = run_workflow(input: { user_id:, workspace_id:, item_id: item.id })

        {
          data: Core::Serializers::ItemSerializer.new(Item.find(result.output[:item][:id])).to_h,
          meta: { cancelled: true }
        }
      end
    end
  end
end
