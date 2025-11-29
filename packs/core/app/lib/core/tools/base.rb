# frozen_string_literal: true

module Core
  module Tools
    class Base
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

        def call(context, params = {})
          new(context).execute(**params.symbolize_keys)
        end
      end

      attr_reader :context

      def initialize(context)
        @context = context
      end

      def execute(**params)
        raise NotImplementedError, "#{self.class}#execute must be implemented"
      end

      protected

        def current_user
          context.respond_to?(:current_user) ? context.current_user : nil
        end

        def current_workspace
          context.respond_to?(:current_workspace) ? context.current_workspace : nil
        end

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
