# frozen_string_literal: true

# == Schema Information
#
# Table name: workspaces
#
#  id         :bigint           not null, primary key
#  active     :boolean          default(TRUE), not null
#  name       :string           not null
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_workspaces_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :workspace do
    name { FFaker::Company.name }
    sequence(:slug) { |n| "workspace-#{n}" }
    active { true }
  end
end
