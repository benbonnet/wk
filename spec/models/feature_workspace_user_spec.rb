# frozen_string_literal: true

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
