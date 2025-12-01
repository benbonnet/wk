# frozen_string_literal: true

module Ui
  module Views
    module Builders
      class TableBuilder
        attr_reader :columns, :row_click_config, :row_href, :row_actions_config, :bulk_actions_config

        def initialize(parent_builder)
          @parent_builder = parent_builder
          @columns = []
          @row_click_config = nil
          @row_href = nil
          @row_actions_config = nil
          @bulk_actions_config = nil
        end

        def column(name, type:, **options)
          @columns << {
            name: name.to_s,
            type:,
            label: options[:label],
            sortable: options[:sortable],
            hideable: options[:hideable],
            filterable: options[:filterable],
            options: options[:options]
          }.compact
        end

        def row_click(opens: nil, href: nil)
          if opens
            @row_click_config = { opens: opens.to_s }
          elsif href
            @row_href = href
          end
        end

        def row_actions(icon: nil, &block)
          nested = ViewBuilder.new
          nested.instance_eval(&block)

          @row_actions_config = {
            icon:,
            elements: nested.elements
          }.compact
        end

        def bulk_actions(&block)
          nested = ViewBuilder.new
          nested.instance_eval(&block)

          @bulk_actions_config = {
            elements: nested.elements
          }
        end
      end
    end
  end
end
