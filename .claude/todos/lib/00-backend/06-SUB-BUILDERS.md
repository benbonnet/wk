# Phase 6: Sub-builders

## Goal

Port all sub-builder classes used by ViewBuilder.

## Files to Create

### 1. packs/ui/lib/ui/views/builders/api_builder.rb

```ruby
# frozen_string_literal: true

module UI
  module Views
    module Builders
      class ApiBuilder
        attr_reader :endpoints

        def initialize
          @endpoints = {}
        end

        def method_missing(name, method:, path:, **options)
          @endpoints[name.to_sym] = {
            method: method.to_s.upcase,
            path:,
            **options.compact
          }
        end

        def respond_to_missing?(*)
          true
        end
      end
    end
  end
end
```

### 2. packs/ui/lib/ui/views/builders/drawers_builder.rb

```ruby
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
```

### 3. packs/ui/lib/ui/views/builders/page_builder.rb

```ruby
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
```

### 4. packs/ui/lib/ui/views/builders/table_builder.rb

```ruby
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
```

### 5. packs/ui/lib/ui/views/builders/relationship_picker_builder.rb

```ruby
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
```

## Verification

```ruby
builder = UI::Views::ViewBuilder.new

builder.api do |a|
  a.create method: :post, path: ""
  a.update method: :patch, path: ":id"
end

builder.drawers do |d|
  d.drawer(:new) do |drawer|
    drawer.title "New Item"
    drawer.body do
      form do
        field :name, kind: "INPUT_TEXT"
      end
    end
  end
end

builder.to_ui_schema
# => { type: "VIEW", api: {...}, drawers: {...}, elements: [] }
```
