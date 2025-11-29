# frozen_string_literal: true

module Core
  module Relationships
    class Service
      attr_reader :source_item, :target_item, :relationship_type, :metadata

      def initialize(source_item:, target_item:, relationship_type:, metadata: {})
        @source_item = source_item
        @target_item = target_item
        @relationship_type = relationship_type.to_s
        @metadata = metadata
      end

      def create(create_inverse: true)
        validate_relationship!

        ActiveRecord::Base.transaction do
          forward = create_link(source_item, target_item, relationship_type)

          if create_inverse && inverse_type
            create_link(target_item, source_item, inverse_type)
          end

          forward
        end
      end

      def destroy(destroy_inverse: true)
        ActiveRecord::Base.transaction do
          destroy_link(source_item, target_item, relationship_type)

          if destroy_inverse && inverse_type
            destroy_link(target_item, source_item, inverse_type)
          end
        end
      end

      def self.create(**args)
        new(**args).create
      end

      def self.destroy(**args)
        new(**args).destroy
      end

      private

        def inverse_type
          @inverse_type ||= Registry.inverse_of(source_item.schema_slug, relationship_type)&.to_s
        end

        def validate_relationship!
          valid = Registry.valid?(
            source_schema: source_item.schema_slug,
            target_schema: target_item.schema_slug,
            relationship_type:
          )

          unless valid
            raise InvalidRelationshipError,
                  "Invalid relationship: #{source_item.schema_slug}->#{relationship_type}->#{target_item.schema_slug}"
          end
        end

        def create_link(source, target, type)
          ItemRelationship.create!(
            source_item: source,
            target_item: target,
            relationship_type: type,
            metadata:
          )
        end

        def destroy_link(source, target, type)
          ItemRelationship.where(
            source_item: source,
            target_item: target,
            relationship_type: type
          ).destroy_all
        end

        class InvalidRelationshipError < StandardError; end
    end
  end
end
