# frozen_string_literal: true

module Core
  module Schema
    class Registry
      class << self
        def all
          @all ||= []
        end

        def clear!
          @all = []
        end

        def register(schema_class)
          all << schema_class unless all.include?(schema_class)
        end

        def find(slug)
          all.find { |s| s.slug == slug.to_s }
        end

        def find!(slug)
          find(slug) || raise(NotFoundError, "Schema '#{slug}' not found")
        end

        def slugs
          all.map(&:slug)
        end

        # Export all schemas for frontend mocks
        def to_mock_data
          all.map(&:to_mock_data)
        end

        # Export schemas for OpenAPI components
        def to_openapi_schemas
          schemas = {}
          all.each do |schema_class|
            name = schema_class.name.demodulize.sub(/Schema$/, "").underscore
            json_schema = schema_class.new.to_json_schema

            schemas[name] = json_schema
            schemas["#{name}_input"] = json_schema
          end
          schemas
        end
      end

      class NotFoundError < StandardError; end
    end

    # Auto-register on inheritance
    class Base
      def self.inherited(subclass)
        super
        # Defer registration until class is fully defined
        TracePoint.new(:end) do |tp|
          if tp.self == subclass
            Registry.register(subclass) unless subclass.name.nil?
            tp.disable
          end
        end.enable
      end
    end
  end
end
