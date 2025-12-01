# frozen_string_literal: true

module Core
  module Tools
    module RailsParameters
      # Extracts permitted parameter keys from tool's params_schema
      # Handles both flat params and nested data: {} objects
      def self.permitted_keys(tool_class)
        schema = tool_class.new.params_schema
        return [] unless schema && schema["properties"]

        schema["properties"].keys.map(&:to_sym)
      end

      # Returns the nested structure for strong params permit
      # e.g., [:id, data: [:first_name, :last_name, :email, recipients_attributes: [...]]]
      def self.permit_structure(tool_class)
        schema = tool_class.new.params_schema
        return [] unless schema && schema["properties"]

        # Get schema class for relationship info
        schema_class = tool_class.respond_to?(:schema_class) ? tool_class.schema_class : nil

        build_permit_structure(schema["properties"], schema_class)
      end

      private_class_method def self.build_permit_structure(properties, schema_class = nil)
        result = []
        nested = {}

        properties.each do |key, prop|
          key_sym = key.to_sym
          if prop["type"] == "object" && prop["properties"]
            # Nested object - recurse and add relationship attributes
            nested_props = build_permit_structure(prop["properties"], schema_class)
            nested_props = add_relationship_attributes(nested_props, schema_class)
            nested[key_sym] = nested_props
          elsif prop["type"] == "array" && prop.dig("items", "type") == "object"
            # Array of objects
            nested[key_sym] = build_permit_structure(prop.dig("items", "properties") || {})
          else
            # Scalar value
            result << key_sym
          end
        end

        result + (nested.empty? ? [] : [nested])
      end

      # Add *_attributes entries for schema relationships
      private_class_method def self.add_relationship_attributes(permit_list, schema_class)
        return permit_list unless schema_class&.respond_to?(:relationships)

        relationships = schema_class.relationships
        return permit_list if relationships.empty?

        # Find or create the nested hash in permit_list
        nested_hash = permit_list.find { |item| item.is_a?(Hash) } || {}
        permit_list = permit_list.reject { |item| item.is_a?(Hash) }

        relationships.each do |rel|
          attr_key = :"#{rel[:name]}_attributes"
          # Get target schema for nested attributes
          target_schema = Schema::Registry.find(rel[:target_schema])
          json_schema = target_schema&.new&.to_json_schema
          properties = json_schema&.dig(:schema, :properties) || {}
          target_fields = properties.keys.map(&:to_sym)

          # Always include :id and :_destroy for nested attributes
          nested_hash[attr_key] = [:id, :_destroy] + target_fields
        end

        permit_list + (nested_hash.empty? ? [] : [nested_hash])
      end
    end
  end
end
