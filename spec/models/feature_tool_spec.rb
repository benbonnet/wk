# frozen_string_literal: true

# == Schema Information
#
# Table name: feature_tools
#
#  id          :bigint           not null, primary key
#  config      :jsonb
#  deleted_at  :datetime
#  description :text
#  slug        :string           not null
#  title       :string           not null
#  tool_type   :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  feature_id  :bigint           not null
#  schema_id   :bigint
#
# Indexes
#
#  index_feature_tools_on_deleted_at           (deleted_at)
#  index_feature_tools_on_feature_id           (feature_id)
#  index_feature_tools_on_schema_id            (schema_id)
#  index_feature_tools_on_slug_and_feature_id  (slug,feature_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (feature_id => features.id)
#  fk_rails_...  (schema_id => schemas.id)
#
require "rails_helper"

RSpec.describe FeatureTool, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:feature) }
  end

  describe "validations" do
    subject { build(:feature_tool) }

    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_inclusion_of(:tool_type).in_array(FeatureTool::VALID_TYPES).allow_nil }

    it "validates uniqueness of slug scoped to feature_id" do
      feature = create(:feature)
      create(:feature_tool, feature:, title: "Test Tool")
      duplicate = build(:feature_tool, feature:, title: "Test Tool")
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:slug]).to include("has already been taken")
    end
  end

  describe "callbacks" do
    it "generates slug from title before validation" do
      tool = build(:feature_tool, title: "My Tool", slug: nil)
      tool.valid?
      expect(tool.slug).to eq("my-tool")
    end
  end

  describe "scopes" do
    let!(:active_tool) { create(:feature_tool) }
    let!(:archived_tool) { create(:feature_tool, deleted_at: Time.current) }

    it ".active returns non-archived tools" do
      expect(described_class.active).to include(active_tool)
      expect(described_class.active).not_to include(archived_tool)
    end

    it ".archived returns archived tools" do
      expect(described_class.archived).to include(archived_tool)
      expect(described_class.archived).not_to include(active_tool)
    end
  end
end
