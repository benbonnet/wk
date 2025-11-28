# frozen_string_literal: true

require "rails_helper"

RSpec.describe InviteItem, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:invite) }
    it { is_expected.to belong_to(:item) }
  end

  describe "validations" do
    subject { build(:invite_item) }

    it { is_expected.to validate_uniqueness_of(:invite_id).scoped_to(:item_id) }
  end
end
