# frozen_string_literal: true

class Activity < ApplicationRecord
  include WorkspaceScoped

  TYPES = %w[page_view api_call user_action system_event error].freeze
  CATEGORIES = %w[navigation authentication data_access ui_interaction system].freeze
  LEVELS = %w[debug info warning error critical].freeze
  belongs_to :user
  belongs_to :item, optional: true

  validates :activity_type, presence: true, inclusion: { in: TYPES }
  validates :category, presence: true, inclusion: { in: CATEGORIES }
  validates :level, presence: true, inclusion: { in: LEVELS }
  validates :message, presence: true
end
