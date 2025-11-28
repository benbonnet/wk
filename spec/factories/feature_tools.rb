# frozen_string_literal: true

FactoryBot.define do
  factory :feature_tool do
    feature
    sequence(:title) { |n| "Tool #{n}" }
    tool_type { "core" }
  end
end
