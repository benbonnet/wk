# frozen_string_literal: true

FactoryBot.define do
  factory :item_relationship do
    source_item { association(:item) }
    target_item { association(:item) }
    relationship_type { "related_to" }
    is_primary { false }
  end
end
