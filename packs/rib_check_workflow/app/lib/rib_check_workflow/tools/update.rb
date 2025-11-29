# frozen_string_literal: true

module RibCheckWorkflow
  module Tools
    class Update < Core::Workflow::Base
      description "Update a RIB request"
      route method: :put, scope: :member
      schema "rib_request"

      params RibRequestSchema

      # Inferred workflow_id: rib_check_update

      def execute(user_id:, workspace_id:, id:, rib_request: {}, **_)
        item = find_item!(id)

        result = run_workflow(input: { user_id:, workspace_id:, item_id: item.id, data: rib_request })

        {
          data: Core::Serializers::ItemSerializer.new(Item.find(result.output[:item][:id])).to_h,
          meta: { updated: true }
        }
      end
    end
  end
end
