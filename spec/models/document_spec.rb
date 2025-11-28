# frozen_string_literal: true

require "rails_helper"

RSpec.describe Document, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:workspace) }
    it { is_expected.to belong_to(:item).optional }
  end

  describe "validations" do
    subject { build(:document) }

    it { is_expected.to validate_presence_of(:title) }
  end
end
