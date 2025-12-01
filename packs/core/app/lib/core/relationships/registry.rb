# frozen_string_literal: true

module Core
  module Relationships
    class Registry
      class << self
        def all
          @all ||= build
        end

        def find(source_schema, relationship_name)
          all.dig(source_schema.to_s, relationship_name.to_sym)
        end

        def inverse_of(source_schema, relationship_name)
          find(source_schema, relationship_name)&.dig(:inverse_name)
        end

        def for_schema(schema_slug)
          all[schema_slug.to_s] || {}
        end

        def valid?(source_schema:, target_schema:, relationship_type:)
          rel = find(source_schema, relationship_type)
          return false unless rel
          rel[:target_schema] == target_schema.to_s
        end

        def reload!
          @all = nil
        end

        def clear!
          @all = nil
        end

        private

          def build
            registry = {}

            Schema::Registry.all.each do |schema_class|
              source = schema_class.slug
              registry[source] ||= {}

              schema_class.relationships.each do |rel|
                registry[source][rel[:name]] = rel
              end
            end

            registry
          end
      end
    end
  end
end
