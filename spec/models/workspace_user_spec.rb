# frozen_string_literal: true

require "rails_helper"

RSpec.describe WorkspaceUser, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:workspace) }
    it { is_expected.to belong_to(:user) }
  end

  describe "validations" do
    subject { build(:workspace_user) }

    it { is_expected.to validate_presence_of(:role) }
    it { is_expected.to validate_inclusion_of(:role).in_array(WorkspaceUser::ROLES) }
    it { is_expected.to validate_uniqueness_of(:workspace_id).scoped_to(:user_id) }
    it { is_expected.to validate_uniqueness_of(:api_key).allow_nil }
    it { is_expected.to validate_uniqueness_of(:api_secret).allow_nil }
  end
end
