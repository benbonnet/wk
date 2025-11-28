# Phase 7: App Integration

## Goal

Create API endpoint for views. No configuration needed.

## Files to Create/Modify

### 1. No initializer needed

The DSL has no configuration. Just require and use.

### 2. app/controllers/api/v1/views_controller.rb

```ruby
# frozen_string_literal: true

module Api
  module V1
    class ViewsController < ApplicationController
      # GET /api/v1/views/:namespace/:feature/:view_name
      def show
        view_class = find_view_class

        if view_class.nil?
          render json: { error: "View not found" }, status: :not_found
          return
        end

        unless view_class.respond_to?(:view_config)
          render json: { error: "Invalid view class" }, status: :unprocessable_entity
          return
        end

        render json: view_class.view_config
      end

      private

        def find_view_class
          class_name = [
            params[:namespace].camelize,
            params[:feature].camelize,
            "Views",
            params[:view_name].camelize
          ].join("::")

          class_name.constantize
        rescue NameError
          nil
        end
    end
  end
end
```

### 3. config/routes.rb

```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "views/:namespace/:feature/:view_name", to: "views#show"
    end
  end
end
```

### 4. Example view class

```ruby
# app/views/workspaces/contacts/views/index.rb
module Workspaces
  module Contacts
    module Views
      class Index
        include UI::Views::BaseView

        view do
          translations(
            en: {
              schemas: {
                contact: { first_name: "First Name", last_name: "Last Name" }
              },
              views: {
                page_title: "Contacts",
                new_contact: "New Contact"
              },
              common: { save: "Save", cancel: "Cancel" }
            }
          )

          api do |a|
            a.index method: :get, path: ""
            a.create method: :post, path: ""
            a.show method: :get, path: ":id"
            a.update method: :patch, path: ":id"
            a.destroy method: :delete, path: ":id"
          end

          drawers do |d|
            d.drawer(:new_drawer) do |drawer|
              drawer.title "new_contact"
              drawer.body do
                form action: :create do
                  field :first_name, kind: "INPUT_TEXT"
                  field :last_name, kind: "INPUT_TEXT"
                  submit "save"
                end
              end
            end
          end

          page do |c|
            c.title "page_title"
            c.actions do
              link "new_contact", opens: :new_drawer, variant: "primary"
            end
            c.body do
              table searchable: true do |t|
                t.column :first_name, kind: "DISPLAY_TEXT", label: "first_name"
                t.column :last_name, kind: "DISPLAY_TEXT", label: "last_name"
                t.row_click opens: :view_drawer
              end
            end
          end
        end
      end
    end
  end
end
```

## Verification

```bash
curl http://localhost:3000/api/v1/views/workspaces/contacts/index
```

Output:
```json
{
  "type": "VIEW",
  "translations": { "en": { ... } },
  "api": { "index": { "method": "GET", "path": "" }, ... },
  "drawers": { "new_drawer": { ... } },
  "elements": [{ "type": "PAGE", ... }]
}
```

## Summary

- No initializer
- No configuration
- Just define view classes and serve them via API
- Pure DSL → JSON
