# frozen_string_literal: true

module Core
  module Workflow
    class Base < Core::Tools::Base
      class << self
        attr_reader :workflow_id_override

        # Explicit workflow ID (optional)
        def workflow_file(id)
          @workflow_id_override = id
        end

        # Inferred from class name
        # RibCheckWorkflow::Tools::Create => rib_check_create
        def inferred_workflow_id
          return nil unless name

          # RibCheckWorkflow::Tools::Create => ["RibCheckWorkflow", "Tools", "Create"]
          parts = name.split("::")
          return nil unless parts.size >= 3

          pack_name = parts[0].underscore.sub(/_workflow$/, "") # rib_check_workflow => rib_check
          action = parts.last.underscore                         # Create => create

          "#{pack_name}_#{action}"
        end

        def workflow_id
          @workflow_id_override || inferred_workflow_id
        end

        def workflow
          Registry.find(workflow_id)
        end
      end

      def run_workflow(input:)
        runner = DurableWorkflow::Runners::Sync.new(self.class.workflow)
        result = runner.run(input:)

        raise Core::Tools::ValidationError.new(result.error, {}) if result.failed?

        result
      end
    end
  end
end
