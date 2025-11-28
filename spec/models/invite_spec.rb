# frozen_string_literal: true

require "rails_helper"

RSpec.describe Invite, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:inviter).class_name("User") }
    it { is_expected.to belong_to(:invitee).class_name("User") }
    it { is_expected.to belong_to(:recipient_workspace).class_name("Workspace").optional }
    it { is_expected.to have_many(:invite_items).dependent(:destroy) }
  end

  describe "validations" do
    subject { build(:invite) }

    it { is_expected.to validate_presence_of(:status) }
    it { is_expected.to validate_inclusion_of(:status).in_array(Invite::STATUSES) }

    it "validates uniqueness of auth_link_hash" do
      existing = create(:invite)
      duplicate = build(:invite, auth_link_hash: existing.auth_link_hash)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:auth_link_hash]).to include("has already been taken")
    end
  end

  describe "callbacks" do
    it "generates auth_link_hash before validation on create" do
      invite = build(:invite, auth_link_hash: nil)
      invite.valid?
      expect(invite.auth_link_hash).to be_present
      expect(invite.auth_link_hash.length).to eq(16)
    end
  end
end
