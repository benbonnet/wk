# frozen_string_literal: true

# == Schema Information
#
# Table name: features
#
#  id           :bigint           not null, primary key
#  config       :jsonb
#  deleted_at   :datetime
#  feature_type :string
#  identifier   :string
#  title        :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_features_on_deleted_at  (deleted_at)
#  index_features_on_identifier  (identifier) UNIQUE
#
FactoryBot.define do
  factory :feature do
    sequence(:title) { |n| "Feature #{n}" }
    feature_type { "core" }
  end
end
