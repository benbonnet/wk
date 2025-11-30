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
      # e.g., [:id, data: [:first_name, :last_name, :email]]
      def self.permit_structure(tool_class)
        schema = tool_class.new.params_schema
        return [] unless schema && schema["properties"]

        build_permit_structure(schema["properties"])
      end

      private_class_method def self.build_permit_structure(properties)
        result = []
        nested = {}

        properties.each do |key, prop|
          key_sym = key.to_sym
          if prop["type"] == "object" && prop["properties"]
            # Nested object - recurse
            nested[key_sym] = build_permit_structure(prop["properties"])
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
    end
  end
end
