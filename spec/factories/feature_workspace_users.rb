# frozen_string_literal: true

FactoryBot.define do
  factory :feature_workspace_user do
    workspace
    user
    feature
    enabled { false }
  end
end
