# frozen_string_literal: true

module Ui
  module Views
    # Mixin for view classes
    # Provides view DSL and config storage
    module BaseView
      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods
        def schema(schema_class = nil)
          if schema_class
            @schema_class = schema_class
          else
            @schema_class
          end
        end

        def frontend_route(path = nil)
          if path
            @frontend_route = path
          else
            @frontend_route
          end
        end

        def routable?
          frontend_route.present?
        end

        def view(&block)
          @view_block = block
        end

        # Returns raw view config WITHOUT url/api (those come from Registry)
        def view_config_raw
          return @view_config_raw if @view_config_raw

          builder = ViewBuilder.new(schema_class: resolve_schema_class)
          builder.instance_eval(&@view_block)
          @view_config_raw = builder.to_ui_schema
        end

        def has_view?
          !@view_block.nil?
        end

        private

          def resolve_schema_class
            return nil unless @schema_class

            # If it's already a class, return it
            return @schema_class if @schema_class.is_a?(Class)

            # If it's a symbol, look it up from schema registry
            if defined?(Core::Schema::Registry)
              Core::Schema::Registry.find(@schema_class)
            end
          end
      end
    end
  end
end
