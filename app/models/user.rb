# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id            :bigint           not null, primary key
#  access_token  :text
#  avatar_url    :string
#  email         :string
#  internal      :boolean          default(FALSE), not null
#  last_login_at :datetime
#  login         :string           not null
#  name          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  auth0_id      :string           not null
#
# Indexes
#
#  index_users_on_auth0_id  (auth0_id) UNIQUE
#  index_users_on_login     (login) UNIQUE
#
class User < ApplicationRecord
  devise :omniauthable, omniauth_providers: [ :auth0 ]

  has_many :workspace_users, dependent: :destroy
  has_many :workspaces, through: :workspace_users

  validates :login, presence: true, uniqueness: true
  validates :auth0_id, presence: true, uniqueness: true

  def self.from_omniauth!(auth)
    info = auth.info

    user = find_or_initialize_by(auth0_id: auth.uid)
    user.login ||= info.nickname || info.email&.split("@")&.first || auth.uid
    user.email = info.email
    user.name = info.name
    user.avatar_url = info.image
    user.save!
    user
  end

  def default_workspace
    workspaces.first || create_default_workspace
  end

  private

    def create_default_workspace
      slug = generate_unique_slug
      workspace = Workspace.create!(name: "#{login}'s Workspace", slug:)
      workspace_users.create!(workspace:, role: "admin")
      workspace
    end

    def generate_unique_slug
      base_slug = login.downcase.gsub(/[^a-z0-9\-]/, "-").gsub(/-+/, "-").gsub(/^-|-$/, "")
      slug = base_slug
      counter = 1

      while Workspace.exists?(slug:)
        slug = "#{base_slug}-#{counter}"
        counter += 1
      end

      slug
    end
end
