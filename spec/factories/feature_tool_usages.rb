# frozen_string_literal: true

FactoryBot.define do
  factory :feature_tool_usage do
    feature_tool
    workspace
    user
    status { "success" }
  end
end
