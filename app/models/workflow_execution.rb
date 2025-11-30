# frozen_string_literal: true

# == Schema Information
#
# Table name: workflow_executions
#
#  id           :uuid             not null, primary key
#  ctx          :jsonb
#  current_step :string
#  error        :text
#  halt_data    :jsonb
#  input        :jsonb
#  recover_to   :string
#  result       :jsonb
#  status       :string           default("running"), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  workflow_id  :string           not null
#
# Indexes
#
#  index_workflow_executions_on_created_at   (created_at)
#  index_workflow_executions_on_status       (status)
#  index_workflow_executions_on_workflow_id  (workflow_id)
#
class WorkflowExecution < ApplicationRecord
  has_many :workflow_entries, foreign_key: :execution_id, dependent: :destroy

  STATUSES = %w[running completed failed halted].freeze

  validates :workflow_id, presence: true
  validates :status, presence: true, inclusion: { in: STATUSES }

  scope :running, -> { where(status: "running") }
  scope :completed, -> { where(status: "completed") }
  scope :failed, -> { where(status: "failed") }
  scope :halted, -> { where(status: "halted") }
end
