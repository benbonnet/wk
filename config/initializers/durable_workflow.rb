# frozen_string_literal: true

require "durable_workflow"
require "durable_workflow/storage/active_record"

Rails.application.config.after_initialize do
  DurableWorkflow.configure do |c|
    c.store = DurableWorkflow::Storage::ActiveRecord.new(
      execution_class: WorkflowExecution,
      entry_class: WorkflowEntry
    )

    c.logger = Rails.logger
  end
end
