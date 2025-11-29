# frozen_string_literal: true

class ItemRelationship < ApplicationRecord
  belongs_to :source_item, class_name: "Item"
  belongs_to :target_item, class_name: "Item"

  validates :relationship_type, presence: true
  validate :prevent_self_relationship

  scope :for_item, ->(item_id) { where(source_item_id: item_id).or(where(target_item_id: item_id)) }
  scope :by_type, ->(type) { where(relationship_type: type) }
  scope :outgoing_from, ->(item_id) { where(source_item_id: item_id) }
  scope :incoming_to, ->(item_id) { where(target_item_id: item_id) }
  scope :primary, -> { where(is_primary: true) }

  private

    def prevent_self_relationship
      if source_item_id == target_item_id
        errors.add(:target_item_id, "cannot be the same as source_item_id")
      end
    end
end
