# frozen_string_literal: true

module Core
  module Validation
    class ErrorTransformer
      # Transform JSON Schema errors (from errors_as_objects: true) to Rails-style
      #
      # Input:
      #   [{ fragment: "#/", message: "...required property of 'first_name'..." }]
      #
      # Output:
      #   { "first_name" => ["can't be blank"] }
      #
      def self.call(json_schema_errors)
        new(json_schema_errors).transform
      end

      def initialize(errors)
        @errors = errors
        @result = {}
      end

      def transform
        @errors.each do |error|
          process_error(error)
        end
        @result
      end

      private

        def process_error(error)
          fragment = error[:fragment] || ""
          message = error[:message] || ""

          field_path, rails_message = parse_error(fragment, message)
          return unless field_path

          add_error(field_path, rails_message)
        end

        def parse_error(fragment, message)
          # Case 1: Missing required at root - extract field from message
          if (match = message.match(/required property of '([^']+)'/))
            return [match[1], "can't be blank"]
          end

          # Case 2: Field-level error - extract from fragment
          path = fragment.sub(%r{^#/?}, "")
          return nil if path.empty?

          [path, humanize_message(message)]
        end

        def humanize_message(msg)
          case msg
          when /required property of/i then "can't be blank"
          when /is not of type.*string/i then "must be a string"
          when /is not of type.*(integer|number)/i then "must be a number"
          when /is not of type.*boolean/i then "must be true or false"
          when /is not of type.*array/i then "must be an array"
          when /is not of type.*object/i then "must be an object"
          when /did not match the regex/i then "is invalid"
          when /is not one of|did not match one of/i then "is not included in the list"
          when /fewer.*than.*allowed|too short/i then "is too short"
          when /more.*than.*allowed|too long/i then "is too long"
          when /less than.*minimum/i then "is too small"
          when /greater than.*maximum/i then "is too large"
          when /additional properties.*not allowed/i then "contains unknown fields"
          else
            # Clean up: remove schema UUID, fragment references
            msg.gsub(/'#\/[^']*'/, "").gsub(/in schema [a-f0-9-]+/i, "").strip.downcase
          end
        end

        def add_error(field_path, message)
          # Parse path: "addresses_attributes/0/city" => ["addresses_attributes", "0", "city"]
          parts = field_path.split("/")
          set_nested_value(@result, parts, message)
        end

        def set_nested_value(hash, parts, message)
          parts.each_with_index do |part, i|
            is_last = (i == parts.length - 1)
            next_part = parts[i + 1]
            is_next_index = next_part&.match?(/^\d+$/)

            if is_last
              # Leaf - set error array
              hash[part] ||= []
              hash[part] << message unless hash[part].include?(message)
            elsif part.match?(/^\d+$/)
              # Array index
              idx = part.to_i
              hash[idx] ||= {}
              hash = hash[idx]
            else
              # Object key
              if is_next_index
                hash[part] ||= []
              else
                hash[part] ||= {}
              end
              hash = hash[part]
            end
          end
        end
    end
  end
end
