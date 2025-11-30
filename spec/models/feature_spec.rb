# frozen_string_literal: true

# == Schema Information
#
# Table name: features
#
#  id           :bigint           not null, primary key
#  config       :jsonb
#  deleted_at   :datetime
#  feature_type :string
#  identifier   :string
#  title        :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_features_on_deleted_at  (deleted_at)
#  index_features_on_identifier  (identifier) UNIQUE
#
require "rails_helper"

RSpec.describe Feature, type: :model do
  describe "associations" do
    it { is_expected.to have_many(:feature_workspace_users).dependent(:destroy) }
    it { is_expected.to have_many(:feature_tools).dependent(:destroy) }
    it { is_expected.to have_many(:feature_views).dependent(:destroy) }
  end

  describe "validations" do
    subject { build(:feature) }

    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_uniqueness_of(:identifier).allow_nil }
    it { is_expected.to validate_inclusion_of(:feature_type).in_array(Feature::VALID_TYPES).allow_nil }
  end

  describe "callbacks" do
    it "generates identifier from title before validation" do
      feature = build(:feature, title: "My Feature", identifier: nil)
      feature.valid?
      expect(feature.identifier).to eq("my-feature")
    end
  end

  describe "scopes" do
    let!(:active_feature) { create(:feature) }
    let!(:archived_feature) { create(:feature, deleted_at: Time.current) }

    it ".active returns non-archived features" do
      expect(described_class.active).to include(active_feature)
      expect(described_class.active).not_to include(archived_feature)
    end

    it ".archived returns archived features" do
      expect(described_class.archived).to include(archived_feature)
      expect(described_class.archived).not_to include(active_feature)
    end
  end
end
