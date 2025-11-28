# frozen_string_literal: true

FactoryBot.define do
  factory :workspace_user do
    workspace
    user
    role { "editor" }
  end
end
