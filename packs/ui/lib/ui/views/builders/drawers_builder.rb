# frozen_string_literal: true

module UI
  module Views
    module Builders
      class DrawersBuilder
        attr_reader :registry

        def initialize(parent_builder)
          @parent_builder = parent_builder
          @registry = {}
        end

        def drawer(name, **options, &block)
          builder = DrawerContentBuilder.new(@parent_builder)
          yield(builder)

          @registry[name.to_sym] = {
            title: builder.title_value,
            description: builder.description_value,
            elements: builder.elements,
            **options.compact
          }.compact
        end
      end

      class DrawerContentBuilder
        attr_reader :elements, :title_value, :description_value

        def initialize(parent_builder)
          @parent_builder = parent_builder
          @elements = []
          @title_value = nil
          @description_value = nil
        end

        def title(value)
          @title_value = value
        end

        def description(value)
          @description_value = value
        end

        def body(view_class = nil, **options, &block)
          if view_class
            config = view_class.view_config
            if config && config[:elements]
              @elements.concat(config[:elements])
            end
          elsif block_given?
            old_elements = @parent_builder.elements
            @parent_builder.instance_variable_set(:@elements, [])
            @parent_builder.instance_eval(&block)
            @elements = @parent_builder.elements
            @parent_builder.instance_variable_set(:@elements, old_elements)
          end
        end
      end
    end
  end
end
