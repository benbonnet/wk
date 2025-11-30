# 13 - Pack Routes

## File: packs/core/config/routes.rb

Auto-loaded by `packs-rails` gem. No manual registration needed.

```ruby
# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Dynamic resource routing - catches all feature endpoints
      # Pattern: /api/v1/:namespace/:feature[/:id][/:action_name]

      scope ":namespace" do
        # Collection routes
        get    ":feature",              to: "core/resources#index"
        post   ":feature",              to: "core/resources#create"
        get    ":feature/:action_name", to: "core/resources#collection_action",
                                        constraints: { action_name: /[a-z_]+/ }
        post   ":feature/:action_name", to: "core/resources#collection_action",
                                        constraints: { action_name: /[a-z_]+/ }

        # Member routes
        get    ":feature/:id",              to: "core/resources#show"
        put    ":feature/:id",              to: "core/resources#update"
        patch  ":feature/:id",              to: "core/resources#update"
        delete ":feature/:id",              to: "core/resources#destroy"
        get    ":feature/:id/:action_name", to: "core/resources#member_action",
                                            constraints: { action_name: /[a-z_]+/ }
        post   ":feature/:id/:action_name", to: "core/resources#member_action",
                                            constraints: { action_name: /[a-z_]+/ }
        put    ":feature/:id/:action_name", to: "core/resources#member_action",
                                            constraints: { action_name: /[a-z_]+/ }
        delete ":feature/:id/:action_name", to: "core/resources#member_action",
                                            constraints: { action_name: /[a-z_]+/ }
      end
    end
  end
end
```

## Route Examples

| HTTP Method | Path | Controller Action | Tool Scope |
|-------------|------|-------------------|------------|
| GET | /api/v1/workspaces/contacts | resources#index | collection |
| POST | /api/v1/workspaces/contacts | resources#create | collection |
| GET | /api/v1/workspaces/contacts/export | resources#collection_action | collection, action: "export" |
| GET | /api/v1/workspaces/contacts/123 | resources#show | member |
| PUT | /api/v1/workspaces/contacts/123 | resources#update | member |
| DELETE | /api/v1/workspaces/contacts/123 | resources#destroy | member |
| POST | /api/v1/workspaces/contacts/123/publish | resources#member_action | member, action: "publish" |

## Notes

- Routes are automatically loaded by `packs-rails`
- The `action_name` constraint (`/[a-z_]+/`) prevents matching numeric IDs
- `namespace` and `feature` params are passed to `Features::Registry.find_tool`
