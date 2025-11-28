# frozen_string_literal: true

FactoryBot.define do
  factory :item_recipient do
    item
    user
    auth_status { "level1" }
  end
end
