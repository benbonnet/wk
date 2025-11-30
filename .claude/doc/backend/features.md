# Features Registry

The Features system organizes tools and views into namespaced, discoverable endpoints. It provides the mapping between HTTP routes and executable code.

## Architecture

```
    config/initializers/features.rb
    (or Core::Features::AutoDiscovery)
                  |
                  v
        Core::Features::Registry
    {
      workspaces: {
        contacts: { schema:, tools: [...], views: [...] },
        activities: { ... }
      },
      admin: { ... }
    }
                  |
                  v
      Core::V1::ResourcesController
    - resolve_feature: Registry.find(namespace, feature)
    - resolve_tool: Registry.find_tool(method, scope, action)
```

## Core::Features::Registry

**Location:** `packs/core/app/lib/core/features/registry.rb`

### Registration

```ruby
Core::Features::Registry.register(
  namespace: :workspaces,      # URL namespace
  feature: :contacts,          # Feature slug
  schema: :contact,            # Primary schema (optional)
  tools: [                     # Tool classes
    ContactsService::Tools::Index,
    ContactsService::Tools::Show,
    ContactsService::Tools::Create,
    ContactsService::Tools::Update,
    ContactsService::Tools::Destroy,
    ContactsService::Tools::AddRelationship
  ],
  views: [                     # View classes (optional)
    ContactsService::Views::Index,
    ContactsService::Views::Show,
    ContactsService::Views::Form
  ]
)
```

### API

| Method | Description |
|--------|-------------|
| `register(namespace:, feature:, ...)` | Register a feature |
| `all` | Returns full registry hash |
| `find(namespace, feature)` | Get feature config |
| `tools_for(namespace, feature)` | Get tools array |
| `views_for(namespace, feature)` | Get views array |
| `find_tool(namespace, feature, http_method:, scope:, action:)` | Find matching tool |
| `find_view(namespace, feature, view_name)` | Find view by name |
| `clear!` | Reset registry |
| `to_mock_data` | Export for frontend |

---

## Namespaces

Namespaces segment the API and determine access patterns:

| Namespace | Description | Example URL |
|-----------|-------------|-------------|
| `workspaces` | Tenant-scoped resources | `/api/v1/workspaces/contacts` |
| `admin` | Admin-only resources | `/api/v1/admin/users` |
| `system` | System-level resources | `/api/v1/system/health` |

---

## Manual Registration

In `config/initializers/features.rb`:

```ruby
Rails.application.config.after_initialize do
  Core::Features::Registry.register(
    namespace: :workspaces,
    feature: :contacts,
    schema: :contact,
    tools: [
      ContactsService::Tools::Index,
      ContactsService::Tools::Show,
      ContactsService::Tools::Create,
      ContactsService::Tools::Update,
      ContactsService::Tools::Destroy
    ],
    views: [
      ContactsService::Views::Index,
      ContactsService::Views::Show,
      ContactsService::Views::Form
    ]
  )

  Core::Features::Registry.register(
    namespace: :workspaces,
    feature: :activities,
    tools: [ActivitiesService::Tools::Index]
  )
end
```

---

## Auto-Discovery

**Location:** `packs/core/app/lib/core/features/auto_discovery.rb`

Automatically discovers and registers features from pack structure.

### Convention

```
packs/
  contacts_service/
    app/lib/contacts_service/
      contact_schema.rb          -> Schema
      tools/
        index.rb                 -> Tool
        show.rb                  -> Tool
      views/
        index.rb                 -> View
```

### Namespace Inference

| Module Name | Namespace |
|-------------|-----------|
| `ContactsService` | `:workspaces` (default) |
| `SystemUsers` | `:system` |
| `AdminContacts` | `:admin` |

### Feature Inference

| Module Name | Feature |
|-------------|---------|
| `ContactsService` | `:contacts` |
| `RibCheckWorkflow` | `:rib_requests` |
| `SystemUsers` | `:users` |

### Usage

```ruby
# In an initializer
Rails.application.config.after_initialize do
  Core::Features::AutoDiscovery.run!
end
```

---

## Tool Resolution

When a request comes in, the controller resolves the tool:

```ruby
# GET /api/v1/workspaces/contacts
#   -> namespace: "workspaces", feature: "contacts"
#   -> HTTP method: GET, scope: collection, action: nil
#   -> Matches: ContactsService::Tools::Index

# POST /api/v1/workspaces/contacts/123/relationships
#   -> namespace: "workspaces", feature: "contacts"
#   -> HTTP method: POST, scope: member, action: "relationships"
#   -> Matches: ContactsService::Tools::AddRelationship
```

### Resolution Logic

```ruby
def resolve_tool
  scope = params[:id].present? ? :member : :collection
  action = params[:action_name]

  @tool_class = Features::Registry.find_tool(
    params[:namespace],
    params[:feature],
    http_method: request.method.downcase.to_sym,
    scope:,
    action:
  )

  head :not_found unless @tool_class
end
```

---

## View Resolution

Views are resolved by name:

```ruby
# GET /api/v1/views/workspaces/contacts/index
view_class = Core::Features::Registry.find_view(:workspaces, :contacts, :index)
# => ContactsService::Views::Index
```

---

## Mock Data Export

For frontend development:

```ruby
Core::Features::Registry.to_mock_data
# => [
#   {
#     namespace: :workspaces,
#     features: [
#       {
#         slug: :contacts,
#         schema: :contact,
#         tools: [
#           { class: "ContactsService::Tools::Index", route: { method: :get, scope: :collection } },
#           ...
#         ],
#         views: ["index", "show", "form"]
#       }
#     ]
#   }
# ]
```

---

## Dynamic Routing

**Location:** `packs/core/config/routes/core.rb`

```ruby
namespace :core, path: "api" do
  namespace :v1 do
    scope ":namespace" do
      # Collection routes
      get    ":feature",              to: "resources#index"
      post   ":feature",              to: "resources#create"
      get    ":feature/:action_name", to: "resources#collection_action"
      post   ":feature/:action_name", to: "resources#collection_action"

      # Member routes
      get    ":feature/:id",              to: "resources#show"
      put    ":feature/:id",              to: "resources#update"
      patch  ":feature/:id",              to: "resources#update"
      delete ":feature/:id",              to: "resources#destroy"
      get    ":feature/:id/:action_name", to: "resources#member_action"
      post   ":feature/:id/:action_name", to: "resources#member_action"
      put    ":feature/:id/:action_name", to: "resources#member_action"
      delete ":feature/:id/:action_name", to: "resources#member_action"
    end
  end
end
```

All routes go through `ResourcesController` which uses the Registry for dispatch.

---

## Best Practices

1. **Consistent naming**: Feature slug should match the primary schema
2. **Complete CRUD**: Register all standard tools (Index, Show, Create, Update, Destroy)
3. **Group related tools**: Keep all tools for an entity in the same feature
4. **Use namespaces**: Separate tenant-scoped from admin resources
5. **Register views**: Include views for frontend rendering
