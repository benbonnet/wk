# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  describe "associations" do
    it { is_expected.to have_many(:workspace_users).dependent(:destroy) }
    it { is_expected.to have_many(:workspaces).through(:workspace_users) }
  end

  describe "validations" do
    subject { build(:user) }

    it { is_expected.to validate_presence_of(:login) }
    it { is_expected.to validate_uniqueness_of(:login) }
    it { is_expected.to validate_presence_of(:auth0_id) }
    it { is_expected.to validate_uniqueness_of(:auth0_id) }
  end
end
