# frozen_string_literal: true

class Workspace < ApplicationRecord
  has_many :workspace_users, dependent: :destroy
  has_many :users, through: :workspace_users
  has_many :activities, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true,
                   format: { with: /\A[a-z0-9\-]+\z/, message: "must be lowercase alphanumeric with hyphens" }
end
