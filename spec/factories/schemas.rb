# frozen_string_literal: true

FactoryBot.define do
  factory :schema do
    sequence(:identifier) { |n| "schema-#{n}" }
    data { { "type" => "object", "properties" => {} } }
  end
end
