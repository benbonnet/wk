# frozen_string_literal: true

class User < ApplicationRecord
  has_many :workspace_users, dependent: :destroy
  has_many :workspaces, through: :workspace_users

  validates :login, presence: true, uniqueness: true
  validates :auth0_id, presence: true, uniqueness: true
end
