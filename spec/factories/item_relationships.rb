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
FactoryBot.define do
  factory :item_relationship do
    source_item { association(:item) }
    target_item { association(:item) }
    relationship_type { "related_to" }
    is_primary { false }
  end
end
