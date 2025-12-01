# frozen_string_literal: true

require "json-schema"

module Core
  module HasSchemaValidation
    extend ActiveSupport::Concern

    included do
      validate :validate_schema_slug_exists
      validate :validate_data_against_schema, if: -> { data.present? && schema_slug.present? }
    end

    private

      def validate_schema_slug_exists
        return if schema_slug.blank?
        return if Core::Schema::Registry.find(schema_slug)

        errors.add(:schema_slug, "is not a registered schema")
      end

      def validate_data_against_schema
        schema_class = Core::Schema::Registry.find(schema_slug)
        return unless schema_class

        json_schema = schema_class.new.to_json_schema[:schema]
        return unless json_schema

        # Strip nested attributes before validation
        clean_data = data.to_h.reject { |k, _| k.to_s.end_with?("_attributes") }

        validation_errors = JSON::Validator.fully_validate(
          json_schema.deep_stringify_keys,
          clean_data.deep_stringify_keys,
          strict: false,
          validate_schema: false
        )

        validation_errors.each do |error|
          # Parse JSON Schema errors and extract field name
          # Format 1: "The property '#/' did not contain a required property of 'first_name'"
          # Format 2: "The property '#/first_name' of type string did not match..."
          if (match = error.match(/required property of '([^']+)'/))
            field = match[1].to_sym
            errors.add(field, "is required")
          elsif (match = error.match(/'#\/([^']+)'/)) && match[1].present?
            field = match[1].to_sym
            message = error.gsub(/'#\/[^']+'\s*/, "").strip
            errors.add(field, message)
          else
            errors.add(:base, error)
          end
        end
      rescue JSON::Schema::ValidationError => e
        errors.add(:base, "Schema validation error: #{e.message}")
      end
  end
end
