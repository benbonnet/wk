# frozen_string_literal: true

# == Schema Information
#
# Table name: workspace_users
# Database name: primary
#
#  id           :bigint           not null, primary key
#  api_key      :string
#  api_secret   :string
#  invited_at   :datetime
#  role         :string           default("editor"), not null
#  status       :string           default("active"), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  invite_id    :bigint
#  user_id      :bigint           not null
#  workspace_id :bigint           not null
#
# Indexes
#
#  index_workspace_users_on_api_key                   (api_key) UNIQUE
#  index_workspace_users_on_api_secret                (api_secret) UNIQUE
#  index_workspace_users_on_invite_id                 (invite_id)
#  index_workspace_users_on_status                    (status)
#  index_workspace_users_on_user_id                   (user_id)
#  index_workspace_users_on_workspace_id              (workspace_id)
#  index_workspace_users_on_workspace_id_and_user_id  (workspace_id,user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (invite_id => invites.id) ON DELETE => nullify
#  fk_rails_...  (user_id => users.id)
#  fk_rails_...  (workspace_id => workspaces.id)
#
FactoryBot.define do
  factory :workspace_user do
    workspace
    user
    role { "editor" }
  end
end
