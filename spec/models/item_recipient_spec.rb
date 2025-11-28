# frozen_string_literal: true

require "rails_helper"

RSpec.describe ItemRecipient, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:item) }
    it { is_expected.to belong_to(:user) }
  end

  describe "validations" do
    subject { build(:item_recipient) }

    it { is_expected.to validate_presence_of(:auth_status) }
    it { is_expected.to validate_inclusion_of(:auth_status).in_array(ItemRecipient::AUTH_STATUSES) }
    it { is_expected.to validate_uniqueness_of(:item_id).scoped_to(:user_id) }
  end
end
