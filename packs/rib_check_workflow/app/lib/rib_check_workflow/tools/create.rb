# frozen_string_literal: true

module RibCheckWorkflow
  module Tools
    class Create < Core::Workflow::Base
      description "Create a RIB request"
      route method: :post, scope: :collection
      schema "rib_request"

      params do
        object :data, of: RibRequestSchema
      end

      # Inferred workflow_id: rib_check_create

      def execute(user_id:, workspace_id:, data: {}, **_)
        result = run_workflow(input: { user_id:, workspace_id:, data: })

        {
          data: Core::Serializers::ItemSerializer.new(Item.find(result.output[:item][:id])).to_h,
          meta: { created: true }
        }
      end
    end
  end
end
