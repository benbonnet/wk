# frozen_string_literal: true

# == Schema Information
#
# Table name: workflow_entries
#
#  id           :uuid             not null, primary key
#  action       :string           not null
#  duration_ms  :integer
#  error        :text
#  input        :jsonb
#  output       :jsonb
#  step_type    :string           not null
#  timestamp    :datetime         not null
#  execution_id :uuid             not null
#  step_id      :string           not null
#
# Indexes
#
#  index_workflow_entries_on_execution_id  (execution_id)
#  index_workflow_entries_on_step_id       (step_id)
#  index_workflow_entries_on_timestamp     (timestamp)
#
# Foreign Keys
#
#  fk_rails_...  (execution_id => workflow_executions.id)
#
class WorkflowEntry < ApplicationRecord
  belongs_to :workflow_execution, foreign_key: :execution_id

  ACTIONS = %w[started completed failed halted].freeze

  validates :step_id, presence: true
  validates :step_type, presence: true
  validates :action, presence: true, inclusion: { in: ACTIONS }
  validates :timestamp, presence: true
end
