# frozen_string_literal: true

require "rails_helper"

RSpec.describe Activity, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:workspace) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:item).optional }
  end

  describe "validations" do
    subject { build(:activity) }

    it { is_expected.to validate_presence_of(:activity_type) }
    it { is_expected.to validate_inclusion_of(:activity_type).in_array(Activity::TYPES) }
    it { is_expected.to validate_presence_of(:category) }
    it { is_expected.to validate_inclusion_of(:category).in_array(Activity::CATEGORIES) }
    it { is_expected.to validate_presence_of(:level) }
    it { is_expected.to validate_inclusion_of(:level).in_array(Activity::LEVELS) }
    it { is_expected.to validate_presence_of(:message) }
  end
end
