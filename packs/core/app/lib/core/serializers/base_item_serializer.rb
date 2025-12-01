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

      # Helper: get target items for a relationship type (uses preloaded data)
      # Available as both class and instance method for use in attribute blocks
      def self.relationship_items(item, type)
        item.outgoing_relationships
          .select { |r| r.relationship_type == type.to_s }
          .filter_map(&:target_item)
      end

      # Helper: count relationships of a type (uses preloaded data, no query)
      def self.relationship_count(item, type)
        item.outgoing_relationships
          .count { |r| r.relationship_type == type.to_s }
      end

      # Instance method delegates to class method
      def relationship_items(item, type)
        self.class.relationship_items(item, type)
      end

      def relationship_count(item, type)
        self.class.relationship_count(item, type)
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
                # Use preloaded outgoing_relationships, filter in Ruby
                rels = item.outgoing_relationships.select { |r| r.relationship_type == rel_name.to_s }

                if cardinality == :one
                  target = rels.first&.target_item
                  target ? { "id" => target.id }.merge(target.data || {}) : nil
                else
                  rels.filter_map do |r|
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
