# frozen_string_literal: true

require "rails_helper"

RSpec.describe FeatureView, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:feature) }
  end

  describe "validations" do
    subject { build(:feature_view) }

    it { is_expected.to validate_presence_of(:title) }

    it "validates uniqueness of slug scoped to feature_id" do
      feature = create(:feature)
      create(:feature_view, feature:, title: "Test View")
      duplicate = build(:feature_view, feature:, title: "Test View")
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:slug]).to include("has already been taken")
    end
  end

  describe "callbacks" do
    it "generates slug from title before validation" do
      view = build(:feature_view, title: "My View", slug: nil)
      view.valid?
      expect(view.slug).to eq("my-view")
    end
  end

  describe "scopes" do
    let!(:active_view) { create(:feature_view) }
    let!(:archived_view) { create(:feature_view, deleted_at: Time.current) }

    it ".active returns non-archived views" do
      expect(described_class.active).to include(active_view)
      expect(described_class.active).not_to include(archived_view)
    end

    it ".archived returns archived views" do
      expect(described_class.archived).to include(archived_view)
      expect(described_class.archived).not_to include(active_view)
    end
  end
end
