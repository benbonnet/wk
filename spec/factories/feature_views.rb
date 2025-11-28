# frozen_string_literal: true

FactoryBot.define do
  factory :feature_view do
    feature
    sequence(:title) { |n| "View #{n}" }
  end
end
