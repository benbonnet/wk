# frozen_string_literal: true

module UI
  module Views
    module Builders
      class PageBuilder
        attr_reader :title_value, :description_value, :actions_elements, :body_elements

        def initialize(parent_builder)
          @parent_builder = parent_builder
          @title_value = nil
          @description_value = nil
          @actions_elements = nil
          @body_elements = []
        end

        def title(value)
          @title_value = value
        end

        def description(value)
          @description_value = value
        end

        def actions(&block)
          old_elements = @parent_builder.elements
          @parent_builder.instance_variable_set(:@elements, [])
          @parent_builder.instance_eval(&block)
          @actions_elements = @parent_builder.elements
          @parent_builder.instance_variable_set(:@elements, old_elements)
        end

        def body(&block)
          old_elements = @parent_builder.elements
          @parent_builder.instance_variable_set(:@elements, [])
          @parent_builder.instance_eval(&block)
          @body_elements = @parent_builder.elements
          @parent_builder.instance_variable_set(:@elements, old_elements)
        end

        def method_missing(name, *args, **kwargs, &block)
          @parent_builder.send(name, *args, **kwargs, &block)
          @body_elements = @parent_builder.elements.dup
        end

        def respond_to_missing?(name, include_private = false)
          @parent_builder.respond_to?(name, include_private)
        end
      end

      class DrawerBuilder
        attr_reader :title_value, :description_value, :content_elements

        def initialize(parent_builder)
          @parent_builder = parent_builder
          @title_value = nil
          @description_value = nil
          @content_elements = []
        end

        def title(value)
          @title_value = value
        end

        def description(value)
          @description_value = value
        end

        def method_missing(name, *args, **kwargs, &block)
          @parent_builder.send(name, *args, **kwargs, &block)
          @content_elements = @parent_builder.elements.dup
        end

        def respond_to_missing?(name, include_private = false)
          @parent_builder.respond_to?(name, include_private)
        end
      end
    end
  end
end
