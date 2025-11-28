# frozen_string_literal: true

class FeatureWorkspaceUser < ApplicationRecord
  belongs_to :workspace
  belongs_to :user
  belongs_to :feature

  validates :workspace_id, uniqueness: { scope: %i[user_id feature_id] }
end
