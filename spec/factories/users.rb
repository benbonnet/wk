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
FactoryBot.define do
  factory :user do
    sequence(:login) { |n| "user#{n}" }
    sequence(:auth0_id) { |n| "auth0|#{n}" }
    name { FFaker::Name.name }
    email { FFaker::Internet.email }
    internal { false }
  end
end
