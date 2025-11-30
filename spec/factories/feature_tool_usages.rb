# frozen_string_literal: true

# == Schema Information
#
# Table name: feature_tool_usages
#
#  id               :bigint           not null, primary key
#  duration_ms      :integer
#  http_status_code :integer
#  metadata         :jsonb
#  status           :string           default("success"), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  feature_tool_id  :bigint           not null
#  user_id          :bigint           not null
#  workspace_id     :bigint           not null
#
# Indexes
#
#  feature_tool_usages_billing                   (workspace_id,feature_tool_id,created_at)
#  feature_tool_usages_time                      (created_at)
#  feature_tool_usages_tool_time                 (feature_tool_id,created_at)
#  feature_tool_usages_user_time                 (user_id,created_at)
#  feature_tool_usages_workspace_time            (workspace_id,created_at)
#  index_feature_tool_usages_on_feature_tool_id  (feature_tool_id)
#  index_feature_tool_usages_on_user_id          (user_id)
#  index_feature_tool_usages_on_workspace_id     (workspace_id)
#
# Foreign Keys
#
#  fk_rails_...  (feature_tool_id => feature_tools.id)
#  fk_rails_...  (user_id => users.id)
#  fk_rails_...  (workspace_id => workspaces.id)
#
FactoryBot.define do
  factory :feature_tool_usage do
    feature_tool
    workspace
    user
    status { "success" }
  end
end
