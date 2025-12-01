# frozen_string_literal: true

require "json-schema"

module Core
  module HasSchemaValidation
    extend ActiveSupport::Concern

    included do
      validate :validate_schema_slug_exists
      validate :validate_data_against_schema, if: -> { data.present? && schema_slug.present? }
    end

    # Public: Get Formik-compatible error structure
    def structured_errors
      return {} unless schema_slug && data

      schema_class = Core::Schema::Registry.find(schema_slug)
      return {} unless schema_class

      json_schema = schema_class.new.to_json_schema[:schema]
      return {} unless json_schema

      clean_data = data.to_h.reject { |k, _| k.to_s.end_with?("_attributes") }

      raw_errors = JSON::Validator.fully_validate(
        json_schema.deep_stringify_keys,
        clean_data.deep_stringify_keys,
        strict: false,
        validate_schema: false,
        errors_as_objects: true
      )

      Core::Validation::ErrorTransformer.call(raw_errors)
    rescue StandardError => e
      Rails.logger.error("Schema validation error: #{e.message}")
      {}
    end

    private

      def validate_schema_slug_exists
        return if schema_slug.blank?
        return if Core::Schema::Registry.find(schema_slug)

        errors.add(:schema_slug, "is not a registered schema")
      end

      def validate_data_against_schema
        structured = structured_errors
        return if structured.empty?

        # Add errors to ActiveRecord for standard Rails flow
        structured.each do |field, messages|
          # Skip nested (arrays/hashes) - only add flat fields to AR errors
          next unless messages.is_a?(Array) && messages.all? { |m| m.is_a?(String) }

          messages.each { |msg| errors.add(field.to_sym, msg) }
        end
      end
  end
end
