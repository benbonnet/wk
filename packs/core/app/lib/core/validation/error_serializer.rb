# frozen_string_literal: true

module Core
  module Validation
    class ErrorSerializer
      # Serialize validation errors for API response
      # Works with:
      #   - Item model (has structured_errors from JSON Schema)
      #   - Standard Rails models (ActiveRecord errors)
      #   - Nested attributes (accepts_nested_attributes_for)
      #
      def self.call(record)
        new(record).serialize
      end

      def initialize(record)
        @record = record
      end

      def serialize
        result = {}

        # 1. Add structured JSON Schema errors (for Item)
        if @record.respond_to?(:structured_errors)
          result.merge!(@record.structured_errors)
        end

        # 2. Add ActiveRecord errors (flat fields)
        @record.errors.each do |error|
          field = error.attribute.to_s
          message = error.message

          # Skip :base errors for now (or add to special key)
          next if field == "base"
          # Skip data errors if we have structured errors (avoid duplication)
          next if field == "data" && @record.respond_to?(:structured_errors)

          result[field] ||= []
          result[field] << message unless result[field].include?(message)
        end

        # 3. Process nested associations (accepts_nested_attributes_for)
        serialize_nested_errors(result)

        result
      end

      private

        def serialize_nested_errors(result)
          return unless @record.class.respond_to?(:reflect_on_all_associations)

          # Find associations with nested errors
          @record.class.reflect_on_all_associations.each do |assoc|
            attr_name = "#{assoc.name}_attributes"
            nested_records = @record.send(assoc.name)
          rescue StandardError
            next
          else
            next unless nested_records

            case assoc.macro
            when :has_many
              nested_errors = serialize_has_many(nested_records)
              result[attr_name] = nested_errors if nested_errors.any?
            when :has_one, :belongs_to
              nested = nested_records
              next unless nested&.errors&.any?
              result[attr_name] = ErrorSerializer.call(nested)
            end
          end
        end

        def serialize_has_many(records)
          return [] unless records.respond_to?(:each)

          records.map do |record|
            record.errors.any? ? ErrorSerializer.call(record) : {}
          end
        end
    end
  end
end
