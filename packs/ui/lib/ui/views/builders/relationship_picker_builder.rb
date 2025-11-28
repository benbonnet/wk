# frozen_string_literal: true

module UI
  module Views
    module Builders
      class RelationshipPickerBuilder
        attr_reader :columns, :form_fields

        def initialize(parent_builder)
          @parent_builder = parent_builder
          @columns = []
          @form_fields = []
        end

        def column(name, kind:, **options)
          @columns << {
            name: name.to_s,
            kind:,
            label: options[:label]
          }.compact
        end

        def form(&block)
          old_elements = @parent_builder.elements
          @parent_builder.instance_variable_set(:@elements, [])
          @parent_builder.instance_eval(&block)
          @form_fields = @parent_builder.elements
          @parent_builder.instance_variable_set(:@elements, old_elements)
        end
      end
    end
  end
end
