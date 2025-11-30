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
require "rails_helper"

RSpec.describe FeatureToolUsage, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:feature_tool) }
    it { is_expected.to belong_to(:workspace) }
    it { is_expected.to belong_to(:user) }
  end

  describe "validations" do
    subject { build(:feature_tool_usage) }

    it { is_expected.to validate_presence_of(:status) }
    it { is_expected.to validate_inclusion_of(:status).in_array(FeatureToolUsage::STATUSES) }
  end

  describe "scopes" do
    let(:workspace) { create(:workspace) }
    let(:user) { create(:user) }
    let(:feature_tool) { create(:feature_tool) }
    let!(:usage1) { create(:feature_tool_usage, workspace:, user:, feature_tool:, status: "success") }
    let!(:usage2) { create(:feature_tool_usage, workspace:, status: "error") }

    it ".for_workspace filters by workspace" do
      expect(described_class.for_workspace(workspace.id)).to include(usage1, usage2)
    end

    it ".for_user filters by user" do
      expect(described_class.for_user(user.id)).to include(usage1)
      expect(described_class.for_user(user.id)).not_to include(usage2)
    end

    it ".successful filters by success status" do
      expect(described_class.successful).to include(usage1)
      expect(described_class.successful).not_to include(usage2)
    end
  end
end
