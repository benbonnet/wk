# frozen_string_literal: true

module UI
  module Views
    # DSL builder for view definitions
    # Pure DSL → JSON structure
    class ViewBuilder
      attr_reader :elements, :api_registry, :drawers_registry

      def initialize
        @elements = []
        @api_registry = {}
        @drawers_registry = {}
        @translations_data = {}
      end

      # ============================================
      # View-level declarations
      # ============================================

      def translations(locales)
        @translations_data = locales
      end

      def api(&block)
        builder = Builders::ApiBuilder.new
        yield(builder)
        @api_registry = builder.endpoints
      end

      def drawers(&block)
        builder = Builders::DrawersBuilder.new(self)
        yield(builder)
        @drawers_registry = builder.registry
      end

      # ============================================
      # Page-level components
      # ============================================

      def page(**options, &block)
        builder = Builders::PageBuilder.new(self)

        if block.arity == 1
          yield(builder)
          nested = builder.body_elements
        else
          nested = build_nested_elements(&block)
        end

        @elements << {
          type: "PAGE",
          title: builder.title_value,
          description: builder.description_value,
          actions: builder.actions_elements,
          elements: nested,
          **options.compact
        }.compact
      end

      def drawer(**options, &block)
        builder = Builders::DrawerBuilder.new(self)

        if block.arity == 1
          yield(builder)
          nested = builder.content_elements
        else
          nested = build_nested_elements(&block)
        end

        @elements << {
          type: "DRAWER",
          title: builder.title_value,
          description: builder.description_value,
          elements: nested,
          **options.compact
        }.compact
      end

      def actions(**options, &block)
        nested = build_nested_elements(&block)

        @elements << {
          type: "ACTIONS",
          elements: nested,
          **options
        }.compact
      end

      # ============================================
      # Primitives
      # ============================================

      def link(label, href: nil, opens: nil, api: nil, notification: nil, **options)
        @elements << {
          type: "LINK",
          label: label.to_s,
          href:,
          opens: opens&.to_s,
          api: api&.to_s,
          notification:,
          **options.compact
        }.compact
      end

      def button(label, **options)
        @elements << {
          type: "BUTTON",
          label: label.to_s,
          **options.compact
        }.compact
      end

      def dropdown(**options, &block)
        nested = build_nested_elements(&block)

        @elements << {
          type: "DROPDOWN",
          elements: nested,
          **options.compact
        }.compact
      end

      def option(label, **options)
        @elements << {
          type: "OPTION",
          label: label.to_s,
          **options.compact
        }.compact
      end

      def search(**options)
        @elements << {
          type: "SEARCH",
          **options.compact
        }.compact
      end

      # ============================================
      # Form container
      # ============================================

      def form(schema: nil, **options, &block)
        nested = build_nested_elements(&block)

        @elements << {
          type: "FORM",
          schema:,
          elements: nested,
          **options.compact
        }.compact
      end

      # ============================================
      # Table container
      # ============================================

      def table(**options, &block)
        builder = Builders::TableBuilder.new(self)
        yield(builder)

        @elements << {
          type: "TABLE",
          columns: builder.columns,
          rowClick: builder.row_click_config,
          rowHref: builder.row_href,
          rowActions: builder.row_actions_config,
          bulkActions: builder.bulk_actions_config,
          **options.compact
        }.compact
      end

      # ============================================
      # Show container
      # ============================================

      def show(**options, &block)
        nested = build_nested_elements(&block)

        @elements << {
          type: "SHOW",
          elements: nested,
          **options.compact
        }.compact
      end

      # ============================================
      # Layout components
      # ============================================

      def group(label = nil, **options, &block)
        nested = build_nested_elements(&block)

        @elements << {
          type: "GROUP",
          label:,
          elements: nested,
          **options.compact
        }.compact
      end

      def card_group(label = nil, **options, &block)
        nested = build_nested_elements(&block)

        @elements << {
          type: "CARD_GROUP",
          label:,
          elements: nested,
          **options.compact
        }.compact
      end

      def multistep(**options, &block)
        nested = build_nested_elements(&block)

        @elements << {
          type: "MULTISTEP",
          elements: nested,
          **options.compact
        }.compact
      end

      def step(label, **options, &block)
        nested = build_nested_elements(&block)

        @elements << {
          type: "STEP",
          label:,
          elements: nested,
          **options.compact
        }.compact
      end

      # ============================================
      # Field components
      # ============================================

      def field(name, kind:, **options)
        @elements << {
          type: "COMPONENT",
          name: name.to_s,
          kind:,
          **options.compact
        }.compact
      end

      def render(name, kind:, **options)
        @elements << {
          type: "COMPONENT",
          name: name.to_s,
          kind:,
          **options.compact
        }.compact
      end

      # ============================================
      # Array components
      # ============================================

      def form_array(name, **options, &block)
        nested = build_nested_elements(&block)

        @elements << {
          type: "FORM_ARRAY",
          name: name.to_s,
          template: nested,
          **options.compact
        }.compact
      end

      def display_array(name, **options, &block)
        nested = build_nested_elements(&block)

        @elements << {
          type: "DISPLAY_ARRAY",
          name: name.to_s,
          template: nested,
          **options.compact
        }.compact
      end

      # ============================================
      # Alert & Submit
      # ============================================

      def alert(label, **options)
        @elements << {
          type: "ALERT",
          label:,
          **options.compact
        }.compact
      end

      def submit(label = nil, **options)
        @elements << {
          type: "SUBMIT",
          label:,
          **options.compact
        }.compact
      end

      # ============================================
      # Relationship components
      # ============================================

      def relationship_picker(name, cardinality:, relation_schema:, **options, &block)
        builder = Builders::RelationshipPickerBuilder.new(self)
        yield(builder) if block_given?

        @elements << {
          type: "RELATIONSHIP_PICKER",
          name: "#{name}_attributes",
          cardinality:,
          relationSchema: relation_schema,
          columns: builder.columns,
          template: builder.form_fields,
          **options.compact
        }.compact
      end

      # ============================================
      # Output
      # ============================================

      def to_ui_schema
        {
          type: "VIEW",
          translations: @translations_data.empty? ? nil : @translations_data,
          api: @api_registry.empty? ? nil : @api_registry,
          drawers: @drawers_registry.empty? ? nil : @drawers_registry,
          elements: @elements
        }.compact
      end

      private

        def build_nested_elements(&block)
          old_elements = @elements
          @elements = []
          instance_eval(&block)
          nested = @elements
          @elements = old_elements
          nested
        end
    end
  end
end
