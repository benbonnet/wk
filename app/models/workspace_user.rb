# frozen_string_literal: true

class WorkspaceUser < ApplicationRecord
  ROLES = %w[admin manager editor].freeze

  belongs_to :workspace
  belongs_to :user

  validates :workspace_id, uniqueness: { scope: :user_id }
  validates :role, presence: true, inclusion: { in: ROLES }
  validates :api_key, uniqueness: true, allow_nil: true
  validates :api_secret, uniqueness: true, allow_nil: true
end
