# frozen_string_literal: true

class WorkflowEntry < ApplicationRecord
  belongs_to :workflow_execution, foreign_key: :execution_id

  ACTIONS = %w[started completed failed halted].freeze

  validates :step_id, presence: true
  validates :step_type, presence: true
  validates :action, presence: true, inclusion: { in: ACTIONS }
  validates :timestamp, presence: true
end
