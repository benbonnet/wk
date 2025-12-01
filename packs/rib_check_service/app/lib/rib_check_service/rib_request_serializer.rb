# frozen_string_literal: true

module RibCheckService
  class RibRequestSerializer < Core::Serializers::BaseItemSerializer
    schema RibRequestSchema

    # Computed attributes
    attribute :recipients_count do |item|
      ItemRelationship.where(source_item_id: item.id, relationship_type: "recipients").count
    end

    attribute :documents_count do |item|
      ItemRelationship.where(source_item_id: item.id, relationship_type: "documents").count
    end
  end
end
