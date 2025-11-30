# frozen_string_literal: true

module Ui
  module Views
    module Builders
      class RelationshipPickerBuilder
        attr_reader :columns, :form_fields, :options

        def initialize(parent_builder)
          @parent_builder = parent_builder
          @columns = []
          @form_fields = []
          @options = {}
        end

        def column(name, type:, **opts)
          @columns << {
            name: name.to_s,
            type:,
            label: opts[:label]
          }.compact
        end

        def display(&block)
          old_elements = @parent_builder.elements
          @parent_builder.instance_variable_set(:@elements, [])
          @parent_builder.instance_eval(&block)
          display_elements = @parent_builder.elements
          @parent_builder.instance_variable_set(:@elements, old_elements)

          # Convert elements to columns
          display_elements.each do |el|
            @columns << {
              name: el[:name],
              type: el[:type]
            }.compact
          end
        end

        def form(&block)
          old_elements = @parent_builder.elements
          @parent_builder.instance_variable_set(:@elements, [])
          @parent_builder.instance_eval(&block)
          @form_fields = @parent_builder.elements
          @parent_builder.instance_variable_set(:@elements, old_elements)
        end

        def label(value)
          @options[:label] = value
        end

        def add_label(value)
          @options[:addLabel] = value
        end

        def empty_message(value)
          @options[:emptyMessage] = value
        end

        def search_placeholder(value)
          @options[:searchPlaceholder] = value
        end

        def confirm_label(value)
          @options[:confirmLabel] = value
        end
      end
    end
  end
end
