# frozen_string_literal: true

# == Schema Information
#
# Table name: feature_workspace_users
#
#  id           :bigint           not null, primary key
#  config       :jsonb
#  enabled      :boolean          default(FALSE), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  feature_id   :bigint           not null
#  user_id      :bigint           not null
#  workspace_id :bigint           not null
#
# Indexes
#
#  idx_feature_workspace_users_unique             (workspace_id,user_id,feature_id) UNIQUE
#  index_feature_workspace_users_on_feature_id    (feature_id)
#  index_feature_workspace_users_on_user_id       (user_id)
#  index_feature_workspace_users_on_workspace_id  (workspace_id)
#
# Foreign Keys
#
#  fk_rails_...  (feature_id => features.id)
#  fk_rails_...  (user_id => users.id)
#  fk_rails_...  (workspace_id => workspaces.id)
#
require "rails_helper"

RSpec.describe FeatureWorkspaceUser, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:workspace) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:feature) }
  end

  describe "validations" do
    subject { build(:feature_workspace_user) }

    it { is_expected.to validate_uniqueness_of(:workspace_id).scoped_to(%i[user_id feature_id]) }
  end
end
