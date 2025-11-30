# frozen_string_literal: true

# == Schema Information
#
# Table name: item_relationships
#
#  id                :bigint           not null, primary key
#  end_date          :date
#  is_primary        :boolean          default(FALSE)
#  metadata          :jsonb
#  relationship_type :string           not null
#  start_date        :date
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  source_item_id    :bigint           not null
#  target_item_id    :bigint           not null
#
# Indexes
#
#  idx_on_source_item_id_relationship_type_505fcadb13             (source_item_id,relationship_type)
#  idx_on_target_item_id_relationship_type_07d3008893             (target_item_id,relationship_type)
#  index_item_relationships_on_relationship_type                  (relationship_type)
#  index_item_relationships_on_source_item_id                     (source_item_id)
#  index_item_relationships_on_source_item_id_and_target_item_id  (source_item_id,target_item_id)
#  index_item_relationships_on_target_item_id                     (target_item_id)
#
# Foreign Keys
#
#  fk_rails_...  (source_item_id => items.id)
#  fk_rails_...  (target_item_id => items.id)
#
require "rails_helper"

RSpec.describe ItemRelationship, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:source_item).class_name("Item") }
    it { is_expected.to belong_to(:target_item).class_name("Item") }
  end

  describe "validations" do
    subject { build(:item_relationship) }

    it { is_expected.to validate_presence_of(:relationship_type) }

    it "prevents self-relationships" do
      item = create(:item)
      relationship = build(:item_relationship, source_item: item, target_item: item)
      expect(relationship).not_to be_valid
      expect(relationship.errors[:target_item_id]).to include("cannot be the same as source_item_id")
    end
  end

  describe "scopes" do
    let(:item1) { create(:item) }
    let(:item2) { create(:item) }
    let!(:relationship) { create(:item_relationship, source_item: item1, target_item: item2, is_primary: true) }
    let!(:other_relationship) { create(:item_relationship) }

    it ".for_item returns relationships for an item" do
      expect(described_class.for_item(item1.id)).to include(relationship)
      expect(described_class.for_item(item2.id)).to include(relationship)
    end

    it ".outgoing_from returns relationships from source" do
      expect(described_class.outgoing_from(item1.id)).to include(relationship)
      expect(described_class.outgoing_from(item2.id)).not_to include(relationship)
    end

    it ".primary returns primary relationships" do
      expect(described_class.primary).to include(relationship)
      expect(described_class.primary).not_to include(other_relationship)
    end
  end
end
