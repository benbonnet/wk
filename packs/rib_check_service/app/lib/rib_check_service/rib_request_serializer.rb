# frozen_string_literal: true

module RibCheckService
  class RibRequestSerializer < Core::Serializers::BaseItemSerializer
    schema RibRequestSchema

    # Computed attributes (use preloaded relationships, no queries)
    attribute :recipients_count do |item|
      relationship_count(item, :recipients)
    end

    attribute :documents_count do |item|
      relationship_count(item, :documents)
    end
  end
end
