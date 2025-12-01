# frozen_string_literal: true

module Core
  module Features
    class Configurator
      def initialize
        @current_feature = nil
        @current_namespace = nil
        @current_schema = nil
      end

      def feature(name, namespace:, schema: nil, &block)
        @current_feature = name.to_sym
        @current_namespace = namespace.to_sym
        @current_schema = schema
        @tools = []
        @views = []

        # Register schema
        Schema::Registry.register(schema) if schema

        instance_eval(&block) if block

        # Register feature
        Registry.register(
          namespace: @current_namespace,
          feature: @current_feature,
          schema: schema&.slug&.to_sym,
          tools: @tools,
          views: @views
        )

        @current_feature = nil
        @current_namespace = nil
        @current_schema = nil
      end

      def tools(*tool_classes)
        @tools.concat(tool_classes)
      end

      def views(*view_classes)
        @views.concat(view_classes)
      end
    end
  end
end
