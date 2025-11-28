# frozen_string_literal: true

FactoryBot.define do
  factory :document do
    title { FFaker::Lorem.sentence }
    user
    workspace
  end
end
