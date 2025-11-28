# frozen_string_literal: true

FactoryBot.define do
  factory :activity do
    workspace
    user
    activity_type { "user_action" }
    category { "data_access" }
    level { "info" }
    message { "User performed an action" }
  end
end
