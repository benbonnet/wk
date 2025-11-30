# frozen_string_literal: true

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
