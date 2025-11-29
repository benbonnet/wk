# frozen_string_literal: true

module Core
  module HasRelationships
    extend ActiveSupport::Concern

    included do
      has_many :outgoing_relationships,
               class_name: "ItemRelationship",
               foreign_key: :source_item_id,
               dependent: :destroy,
               inverse_of: :source_item

      has_many :incoming_relationships,
               class_name: "ItemRelationship",
               foreign_key: :target_item_id,
               dependent: :destroy,
               inverse_of: :target_item

      has_many :related_items,
               through: :outgoing_relationships,
               source: :target_item

      has_many :inverse_related_items,
               through: :incoming_relationships,
               source: :source_item
    end

    def schema_class
      @schema_class ||= Schema::Registry.find(schema_slug)
    end

    def relationships_of_type(type)
      outgoing_relationships
        .where(relationship_type: type.to_s)
        .includes(:target_item)
    end

    def related_of_type(type)
      relationships_of_type(type).map(&:target_item)
    end

    def load_relationships
      return {} unless schema_class

      schema_class.relationships.each_with_object({}) do |rel, acc|
        items = related_of_type(rel[:name])
        acc[rel[:name].to_s] = rel[:cardinality] == :one ? items.first : items
      end
    end

    def add_relationship(target, type, metadata: {})
      Relationships::Service.create(
        source_item: self,
        target_item: target,
        relationship_type: type,
        metadata:
      )
    end

    def remove_relationship(target, type)
      Relationships::Service.destroy(
        source_item: self,
        target_item: target,
        relationship_type: type
      )
    end
  end
end
