# frozen_string_literal: true

class FeatureToolUsage < ApplicationRecord
  STATUSES = %w[success error unauthorized].freeze

  belongs_to :feature_tool
  belongs_to :workspace
  belongs_to :user

  validates :status, presence: true, inclusion: { in: STATUSES }

  scope :for_workspace, ->(workspace_id) { where(workspace_id:) }
  scope :for_user, ->(user_id) { where(user_id:) }
  scope :for_tool, ->(feature_tool_id) { where(feature_tool_id:) }
  scope :successful, -> { where(status: "success") }
  scope :in_period, ->(start_date, end_date) { where(created_at: start_date..end_date) }
end
