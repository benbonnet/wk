# frozen_string_literal: true

module Core
  module Workflow
    class Registry
      class << self
        def workflows
          @workflows ||= {}
        end

        def register(path)
          wf = DurableWorkflow.load(path.to_s)
          workflows[wf.id] = wf
          wf
        end

        def find(id)
          workflows[id] || raise(WorkflowNotFoundError, "Workflow not found: #{id}")
        end

        def find_or_register(id, path)
          workflows[id] ||= register(path)
        end

        # Load all conventioned workflows at boot
        def load_all!
          Rails.root.glob("packs/**/workflows/*.yml").each do |path|
            register(path)
          end
        end

        def registered_ids
          workflows.keys
        end
      end
    end

    class WorkflowNotFoundError < StandardError; end
  end
end
