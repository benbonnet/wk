# frozen_string_literal: true

module UI
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

        def column(name, kind:, **options)
          @columns << {
            name: name.to_s,
            kind:,
            label: options[:label],
            sortable: options[:sortable],
            hideable: options[:hideable],
            filterable: options[:filterable]
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
          builder = ActionsBuilder.new(@parent_builder)
          yield(builder)

          @row_actions_config = {
            icon:,
            elements: builder.elements
          }.compact
        end

        def bulk_actions(&block)
          builder = ActionsBuilder.new(@parent_builder)
          yield(builder)

          @bulk_actions_config = {
            elements: builder.elements
          }
        end
      end

      class ActionsBuilder
        attr_reader :elements

        def initialize(parent_builder)
          @parent_builder = parent_builder
          @elements = []
        end

        def action(label, **options)
          @elements << {
            type: "OPTION",
            label: label.to_s,
            href: options[:href],
            opens: options[:opens]&.to_s,
            api: options[:api]&.to_s,
            icon: options[:icon],
            confirm: options[:confirm],
            variant: options[:variant],
            notification: options[:notification]
          }.compact
        end
      end
    end
  end
end
