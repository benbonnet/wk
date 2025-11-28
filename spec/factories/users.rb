# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:login) { |n| "user#{n}" }
    sequence(:auth0_id) { |n| "auth0|#{n}" }
    name { FFaker::Name.name }
    email { FFaker::Internet.email }
    internal { false }
  end
end
