# frozen_string_literal: true

FactoryBot.define do
  factory :core_item, class: "Item" do
    association :created_by, factory: :user
    schema_slug { "contact" }
    tool_slug { "create" }
    data { { "first_name" => "John", "last_name" => "Doe" } }
  end

  factory :core_item_relationship, class: "ItemRelationship" do
    association :source_item, factory: :core_item
    association :target_item, factory: :core_item
    relationship_type { "children" }
  end
end
