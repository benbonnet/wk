# frozen_string_literal: true

FactoryBot.define do
  factory :feature do
    sequence(:title) { |n| "Feature #{n}" }
    feature_type { "core" }
  end
end
