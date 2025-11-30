# frozen_string_literal: true

# == Schema Information
#
# Table name: activities
#
#  id            :bigint           not null, primary key
#  activity_type :string           not null
#  category      :string           not null
#  duration_ms   :integer
#  error_code    :string
#  error_stack   :text
#  feature_slug  :string
#  level         :string           not null
#  message       :text             not null
#  metadata      :jsonb
#  schema_slug   :string
#  tool_slug     :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  item_id       :bigint
#  user_id       :bigint           not null
#  workspace_id  :bigint           not null
#
# Indexes
#
#  index_activities_on_activity_type  (activity_type)
#  index_activities_on_created_at     (created_at)
#  index_activities_on_feature_slug   (feature_slug)
#  index_activities_on_item_id        (item_id)
#  index_activities_on_schema_slug    (schema_slug)
#  index_activities_on_tool_slug      (tool_slug)
#  index_activities_on_user_id        (user_id)
#  index_activities_on_workspace_id   (workspace_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => items.id)
#  fk_rails_...  (user_id => users.id)
#  fk_rails_...  (workspace_id => workspaces.id)
#
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
