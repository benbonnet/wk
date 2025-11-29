# frozen_string_literal: true

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
