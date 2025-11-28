# frozen_string_literal: true

FactoryBot.define do
  factory :item do
    workspace
    created_by { association(:user) }
    schema_slug { "contacts" }
    tool_slug { "create" }
    data { { "name" => "Test Item" } }
  end
end
