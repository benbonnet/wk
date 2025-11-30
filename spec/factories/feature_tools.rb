# frozen_string_literal: true

# == Schema Information
#
# Table name: feature_tools
#
#  id          :bigint           not null, primary key
#  config      :jsonb
#  deleted_at  :datetime
#  description :text
#  slug        :string           not null
#  title       :string           not null
#  tool_type   :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  feature_id  :bigint           not null
#  schema_id   :bigint
#
# Indexes
#
#  index_feature_tools_on_deleted_at           (deleted_at)
#  index_feature_tools_on_feature_id           (feature_id)
#  index_feature_tools_on_schema_id            (schema_id)
#  index_feature_tools_on_slug_and_feature_id  (slug,feature_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (feature_id => features.id)
#  fk_rails_...  (schema_id => schemas.id)
#
FactoryBot.define do
  factory :feature_tool do
    feature
    sequence(:title) { |n| "Tool #{n}" }
    tool_type { "core" }
  end
end
