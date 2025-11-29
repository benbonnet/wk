# frozen_string_literal: true

module Core
  module Tools
    class Base < RubyLLM::Tool
      include Routing

      class << self
        attr_reader :schema_slug, :serializer_name

        def schema(slug)
          @schema_slug = slug.to_s
        end

        def serializer(name)
          @serializer_name = name
        end

        def schema_class
          Schema::Registry.find(schema_slug)
        end

        # Entry point - called by controller and workflows
        def execute(**params)
          new.execute(**params)
        end
      end

      def execute(**params)
        raise NotImplementedError, "#{self.class}#execute must be implemented"
      end

      protected

        def schema_class
          self.class.schema_class
        end

        def items
          Item.where(schema_slug: self.class.schema_slug)
        end

        def find_item(id)
          items.find_by(id:)
        end

        def find_item!(id)
          items.find(id)
        rescue ActiveRecord::RecordNotFound
          raise NotFoundError, "#{self.class.schema_slug} not found: #{id}"
        end
    end

    # Error classes
    class ValidationError < StandardError
      attr_reader :details
      def initialize(message, details = {})
        super(message)
        @details = details
      end
    end

    class NotFoundError < StandardError; end
    class ForbiddenError < StandardError; end
  end
end
