# frozen_string_literal: true

require "rails_helper"

RSpec.describe Workspace, type: :model do
  describe "associations" do
    it { is_expected.to have_many(:workspace_users).dependent(:destroy) }
    it { is_expected.to have_many(:users).through(:workspace_users) }
    it { is_expected.to have_many(:activities).dependent(:destroy) }
  end

  describe "validations" do
    subject { build(:workspace) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:slug) }
    it { is_expected.to validate_uniqueness_of(:slug) }
    it { is_expected.to allow_value("my-workspace-1").for(:slug) }
    it { is_expected.not_to allow_value("My Workspace").for(:slug) }
  end
end
