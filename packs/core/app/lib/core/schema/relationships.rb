# frozen_string_literal: true

module Core
  module Schema
    module Relationships
      extend ActiveSupport::Concern

      class_methods do
        def relationships(&block)
          if block_given?
            @relationship_builder = RelationshipBuilder.new
            @relationship_builder.instance_eval(&block)
          end
          @relationship_builder&.definitions || []
        end

        def has_relationship?(name)
          relationships.any? { |r| r[:name] == name.to_sym }
        end

        def find_relationship(name)
          relationships.find { |r| r[:name] == name.to_sym }
        end
      end

      class RelationshipBuilder
        attr_reader :definitions

        def initialize
          @definitions = []
        end

        def has_one(name, schema:, inverse: nil, description: nil, **opts)
          @definitions << {
            name: name.to_sym,
            cardinality: :one,
            target_schema: schema.to_s,
            inverse_name: inverse&.to_sym,
            description:,
            **opts
          }
        end

        def has_many(name, schema:, inverse: nil, description: nil, **opts)
          @definitions << {
            name: name.to_sym,
            cardinality: :many,
            target_schema: schema.to_s,
            inverse_name: inverse&.to_sym,
            description:,
            **opts
          }
        end

        def belongs_to(name, schema:, inverse: nil, description: nil, **opts)
          has_one(name, schema:, inverse:, description:, **opts)
        end
      end
    end
  end
end
