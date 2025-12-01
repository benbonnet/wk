# frozen_string_literal: true

# == Schema Information
#
# Table name: invites
# Database name: primary
#
#  id                     :bigint           not null, primary key
#  auth_link_hash         :string           not null
#  invitee_email          :string
#  invitee_phone          :string
#  source_type            :string
#  status                 :string           default("pending"), not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  invitee_id             :bigint
#  inviter_id             :bigint           not null
#  recipient_workspace_id :bigint
#  source_id              :bigint
#  workspace_id           :bigint           not null
#
# Indexes
#
#  index_invites_on_auth_link_hash             (auth_link_hash) UNIQUE
#  index_invites_on_invitee_email              (invitee_email)
#  index_invites_on_invitee_id                 (invitee_id)
#  index_invites_on_inviter_id                 (inviter_id)
#  index_invites_on_recipient_workspace_id     (recipient_workspace_id)
#  index_invites_on_source_type_and_source_id  (source_type,source_id)
#  index_invites_on_status                     (status)
#  index_invites_on_workspace_id               (workspace_id)
#
# Foreign Keys
#
#  fk_rails_...  (invitee_id => users.id)
#  fk_rails_...  (inviter_id => users.id)
#  fk_rails_...  (recipient_workspace_id => workspaces.id)
#  fk_rails_...  (workspace_id => workspaces.id)
#
require "rails_helper"

RSpec.describe Invite, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:workspace).required }
    it { is_expected.to belong_to(:inviter).class_name("User") }
    it { is_expected.to belong_to(:invitee).class_name("User").optional }
    it { is_expected.to belong_to(:recipient_workspace).class_name("Workspace").optional }
    it { is_expected.to belong_to(:source).optional }
    it { is_expected.to have_many(:invite_items).dependent(:destroy) }
  end

  describe "validations" do
    subject { build(:invite) }

    it { is_expected.to validate_presence_of(:status) }
    it { is_expected.to validate_inclusion_of(:status).in_array(Invite::STATUSES) }
    it { is_expected.to validate_presence_of(:invitee_email) }

    it "validates uniqueness of auth_link_hash" do
      existing = create(:invite)
      duplicate = build(:invite, auth_link_hash: existing.auth_link_hash)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:auth_link_hash]).to include("has already been taken")
    end

    it "validates email format" do
      invite = build(:invite, invitee_email: "invalid-email")
      expect(invite).not_to be_valid
      expect(invite.errors[:invitee_email]).to include("is invalid")
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

  describe "#link_to_user!" do
    let(:invite) { create(:invite, invitee_email: "john@example.com", invitee: nil) }
    let(:user) { create(:user, email: "john@example.com") }

    it "links the invite to the user" do
      invite.link_to_user!(user)
      expect(invite.reload.invitee).to eq(user)
    end

    it "handles email case insensitivity" do
      user_upper = create(:user, email: "JOHN@EXAMPLE.COM")
      invite_lower = create(:invite, invitee_email: "john@example.com", invitee: nil)

      invite_lower.link_to_user!(user_upper)
      expect(invite_lower.reload.invitee).to eq(user_upper)
    end

    it "handles whitespace in emails" do
      user_spaces = create(:user, email: "  john@example.com  ")
      invite_clean = create(:invite, invitee_email: "john@example.com", invitee: nil)

      invite_clean.link_to_user!(user_spaces)
      expect(invite_clean.reload.invitee).to eq(user_spaces)
    end

    it "raises error on email mismatch" do
      other_user = create(:user, email: "other@example.com")
      expect { invite.link_to_user!(other_user) }.to raise_error("Email mismatch")
    end
  end
end
