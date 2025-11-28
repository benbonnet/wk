# frozen_string_literal: true

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
