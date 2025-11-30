# frozen_string_literal: true

# == Schema Information
#
# Table name: feature_views
#
#  id          :bigint           not null, primary key
#  config      :jsonb
#  deleted_at  :datetime
#  description :text
#  slug        :string           not null
#  title       :string           not null
#  view_type   :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  feature_id  :bigint           not null
#
# Indexes
#
#  index_feature_views_on_deleted_at           (deleted_at)
#  index_feature_views_on_feature_id           (feature_id)
#  index_feature_views_on_slug_and_feature_id  (slug,feature_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (feature_id => features.id)
#
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
