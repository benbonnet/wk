# frozen_string_literal: true

module Core
  module Serializers
    class ItemSerializer
      include Alba::Resource
      include Typelizer::DSL

      attributes :id, :data, :workspace_id, :created_by_id, :updated_by_id, :schema_slug, :tool_slug

      attribute :created_at do |item|
        item.created_at&.iso8601
      end

      attribute :updated_at do |item|
        item.updated_at&.iso8601
      end

      attribute :deleted_at do |item|
        item.deleted_at&.iso8601
      end

      # Include relationships based on schema definition
      attribute :relationships do |item|
        load_relationships(item)
      end

      private

        # Load relationships for an item based on its schema definition
        # @param item [Item] The source item
        # @return [Hash] Relationship data keyed by relationship name
        def load_relationships(item)
          return {} unless item.schema_slug

          schema_class = Core::Schema::Registry.find(item.schema_slug)
          return {} unless schema_class&.respond_to?(:relationships)

          relationships = schema_class.relationships || []
          return {} if relationships.empty?

          result = {}

          relationships.each do |rel|
            rel_name = rel[:name].to_s
            cardinality = rel[:cardinality]

            rel_records = ItemRelationship
              .where(source_item_id: item.id, relationship_type: rel_name)
              .includes(:target_item)

            if cardinality == :one
              target = rel_records.first&.target_item
              result[rel_name] = target ? { "id" => target.id }.merge(target.data) : nil
            else
              result[rel_name] = rel_records.filter_map do |r|
                next unless r.target_item
                { "id" => r.target_item.id }.merge(r.target_item.data)
              end
            end
          end

          result
        end
    end
  end
end
