# frozen_string_literal: true

module Core
  module Schema
    class Base < RubyLLM::Schema
      include Translations
      include Relationships

      class << self
        def title(value = nil)
          @title = value if value
          @title || name&.demodulize&.sub(/Schema$/, "")
        end

        def slug(value = nil)
          @slug = value if value
          @slug || title&.parameterize
        end

        # Common field helpers
        def timestamps
          string :created_at, format: "date-time", required: false
          string :updated_at, format: "date-time", required: false
        end

        def soft_delete
          string :deleted_at, format: "date-time", required: false
        end

        def slug_field(field_name = :slug, max_length: 255)
          string field_name, max_length:, pattern: "^[a-z0-9-]+$"
        end

        def status_field(field_name = :status, values:)
          string field_name, enum: values
        end

        def metadata_field(field_name = :metadata)
          object field_name, required: false do
            additional_properties true
          end
        end

        # Full export including relationships and translations
        def to_full_schema
          {
            slug:,
            title:,
            description:,
            json_schema: new.to_json_schema,
            relationships:,
            translations:
          }
        end

        # Export for frontend mocks
        def to_mock_data
          {
            slug:,
            title:,
            schema: new.to_json_schema,
            relationships: relationships.map do |r|
              {
                name: r[:name],
                cardinality: r[:cardinality],
                targetSchema: r[:target_schema],
                inverseName: r[:inverse_name]
              }
            end,
            translations:
          }
        end
      end
    end
  end
end
