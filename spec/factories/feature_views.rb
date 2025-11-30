# frozen_string_literal: true

# == Schema Information
#
# Table name: feature_views
#
#  id          :bigint           not null, primary key
#  config      :jsonb
#  deleted_at  :datetime
#  description :text
#  slug        :string           not null
#  title       :string           not null
#  view_type   :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  feature_id  :bigint           not null
#
# Indexes
#
#  index_feature_views_on_deleted_at           (deleted_at)
#  index_feature_views_on_feature_id           (feature_id)
#  index_feature_views_on_slug_and_feature_id  (slug,feature_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (feature_id => features.id)
#
FactoryBot.define do
  factory :feature_view do
    feature
    sequence(:title) { |n| "View #{n}" }
  end
end
