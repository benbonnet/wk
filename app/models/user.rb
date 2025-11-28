# frozen_string_literal: true

class User < ApplicationRecord
  devise :omniauthable, omniauth_providers: [:auth0]

  has_many :workspace_users, dependent: :destroy
  has_many :workspaces, through: :workspace_users

  validates :login, presence: true, uniqueness: true
  validates :auth0_id, presence: true, uniqueness: true

  def self.from_omniauth(auth)
    find_by(auth0_id: auth.uid)
  end
end
