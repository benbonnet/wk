# Phase 5: Base View Module

## Goal

Pure DSL mixin. No auto-derivation. Everything explicit.

## Files to Create

### 1. packs/ui/lib/ui/views/base_view.rb

```ruby
# frozen_string_literal: true

module UI
  module Views
    # View DSL base class
    # Pure DSL → JSON. No magic.
    #
    # Usage:
    #   class IndexView
    #     include UI::Views::BaseView
    #
    #     view do
    #       translations(
    #         en: {
    #           schemas: { contact: { first_name: "First Name" } },
    #           views: { page_title: "Contacts" },
    #           common: { save: "Save" }
    #         }
    #       )
    #
    #       api do |a|
    #         a.create method: :post, path: ""
    #         a.update method: :patch, path: ":id"
    #       end
    #
    #       drawers do |d|
    #         d.drawer(:new_drawer) { ... }
    #       end
    #
    #       page do |c|
    #         c.title "page_title"
    #         table do
    #           column :name, kind: "DISPLAY_TEXT"
    #         end
    #       end
    #     end
    #   end
    module BaseView
      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods
        # Define view configuration
        # @yield Block for view definition
        def view(&block)
          if block
            @view_builder = ViewBuilder.new
            @view_builder.instance_eval(&block)
          end
          @view_builder
        end

        # Get view configuration as UISchema JSON
        # @return [Hash, nil]
        def view_config
          @view_builder&.to_ui_schema
        end

        # Check if view is defined
        def has_view?
          !@view_builder.nil?
        end
      end
    end
  end
end
```

## What's NOT Here

- ❌ `url` method - Frontend knows where it fetched from
- ❌ `schema` method - Translations are inline
- ❌ `translation_namespace` - Not needed
- ❌ `merged_translations` - Translations declared explicitly
- ❌ Schema/feature lookup - Everything in the DSL

## Verification

```ruby
class TestView
  include UI::Views::BaseView

  view do
    translations(
      en: {
        schemas: { contact: { first_name: "First Name" } },
        views: { page_title: "Contacts" },
        common: {}
      }
    )

    api do |a|
      a.index method: :get, path: ""
      a.create method: :post, path: ""
    end

    page do |c|
      c.title "page_title"
    end
  end
end

TestView.view_config
# => {
#   type: "VIEW",
#   translations: { en: { schemas: {...}, views: {...}, common: {} } },
#   api: { index: { method: "GET", path: "" }, ... },
#   elements: [{ type: "PAGE", title: "page_title", ... }]
# }
```
