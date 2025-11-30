# frozen_string_literal: true

module Ui
  module Views
    # DSL builder for view definitions
    # Pure DSL → JSON structure
    class ViewBuilder
      attr_reader :elements, :drawers_registry
      attr_accessor :schema_class

      def initialize(schema_class: nil)
        @elements = []
        @drawers_registry = {}
        @translations_data = {}
        @schema_class = schema_class
        @field_prefix = nil
      end

      # ============================================
      # View-level declarations
      # ============================================

      def translations(locales)
        @translations_data = locales
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

      def step(label = nil, **options, &block)
        nested = build_nested_elements(&block)
        step_label = label || options.delete(:label)

        @elements << {
          type: "STEP",
          label: step_label,
          elements: nested,
          **options.compact
        }.compact
      end

      # ============================================
      # Field components
      # ============================================

      def field(name, type:, **options)
        # Apply prefix if in relationship context (has_one)
        field_name = @field_prefix ? "#{@field_prefix}.#{name}" : name.to_s

        @elements << {
          type:,
          name: field_name,
          **options.compact
        }.compact
      end

      def render(name, type:, **options)
        @elements << {
          type:,
          name: name.to_s,
          **options.compact
        }.compact
      end

      # ============================================
      # Array components
      # ============================================

      def form_array(name, **options, &block)
        nested = build_nested_elements(&block)

        # Convert snake_case to camelCase for frontend
        add_label = options.delete(:add_label)
        remove_label = options.delete(:remove_label)

        @elements << {
          type: "FORM_ARRAY",
          name: name.to_s,
          template: nested,
          addLabel: add_label,
          removeLabel: remove_label,
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

      # Unified relationship method - auto-detects cardinality from schema
      # has_one -> GROUP with prefixed fields (spouse_attributes.first_name)
      # has_many -> FORM_ARRAY with add/remove
      def relationship(name, label: nil, add_label: nil, remove_label: nil, **options, &block)
        raise ArgumentError, "relationship requires a block to define fields" unless block_given?

        # Find relationship definition from schema
        relationship_def = @schema_class&.relationships&.find { |r| r[:name] == name.to_sym }
        raise ArgumentError, "Relationship :#{name} not found in schema" unless relationship_def

        display_label = label || name.to_s
        attributes_name = "#{name}_attributes"

        case relationship_def[:cardinality]
        when :one
          # has_one -> GROUP with prefixed fields
          fields = with_field_prefix(attributes_name) do
            build_nested_elements(&block)
          end

          @elements << {
            type: "GROUP",
            name: attributes_name,
            label: display_label,
            elements: fields,
            **options.compact
          }.compact

        when :many
          # has_many -> FORM_ARRAY with template
          fields = build_nested_elements(&block)

          @elements << {
            type: "FORM_ARRAY",
            name: attributes_name,
            label: display_label,
            addLabel: add_label,
            removeLabel: remove_label,
            template: fields,
            **options.compact
          }.compact
        end
      end

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
          **builder.options,
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
          drawers: @drawers_registry.empty? ? nil : @drawers_registry,
          elements: @elements
        }.compact
      end

      private

        def build_nested_elements(&block)
          old_elements = @elements
          old_prefix = @field_prefix
          @elements = []
          instance_eval(&block)
          nested = @elements
          @elements = old_elements
          @field_prefix = old_prefix
          nested
        end

        # Set field prefix context for relationship fields
        def with_field_prefix(prefix)
          old_prefix = @field_prefix
          @field_prefix = prefix
          result = yield
          @field_prefix = old_prefix
          result
        end
    end
  end
end
