# frozen_string_literal: true

module Core
  module Serializers
    class BaseItemSerializer
      include Alba::Resource

      # Base attributes always present
      attributes :id, :workspace_id, :schema_slug, :created_by_id, :updated_by_id

      attribute :created_at do |item|
        item.created_at&.iso8601
      end

      attribute :updated_at do |item|
        item.updated_at&.iso8601
      end

      # Subclasses call `flatten_data_fields` to add flattened attributes
      # and `flatten_relationships` to add *_attributes
      class << self
        attr_accessor :schema_class

        def schema(klass)
          @schema_class = klass
          flatten_data_fields(klass)
          flatten_relationships(klass)
        end

        private

          def flatten_data_fields(schema_class)
            json_schema = schema_class.new.to_json_schema
            fields = json_schema.dig(:schema, :properties)&.keys || []

            fields.each do |field_name|
              attribute field_name.to_sym do |item|
                item.data&.dig(field_name.to_s)
              end
            end
          end

          def flatten_relationships(schema_class)
            return unless schema_class.respond_to?(:relationships)

            schema_class.relationships.each do |rel|
              rel_name = rel[:name]
              cardinality = rel[:cardinality]
              attr_name = "#{rel_name}_attributes".to_sym

              attribute attr_name do |item|
                rel_records = ItemRelationship
                  .where(source_item_id: item.id, relationship_type: rel_name.to_s)
                  .includes(:target_item)

                if cardinality == :one
                  target = rel_records.first&.target_item
                  target ? { "id" => target.id }.merge(target.data || {}) : nil
                else
                  rel_records.filter_map do |r|
                    next unless r.target_item
                    { "id" => r.target_item.id }.merge(r.target_item.data || {})
                  end
                end
              end
            end
          end
      end
    end
  end
end
