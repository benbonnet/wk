# frozen_string_literal: true

FactoryBot.define do
  factory :workspace do
    name { FFaker::Company.name }
    sequence(:slug) { |n| "workspace-#{n}" }
    active { true }
  end
end
