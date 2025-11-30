# Backend Tools System

The Tools system provides a unified way to define API endpoints as executable actions. Each tool represents a single operation (CRUD or custom action) that can be exposed via REST API, invoked by workflows, or called by LLM agents.

## Architecture Overview

```
HTTP Request: GET /api/v1/workspaces/contacts
                        |
                        v
        Core::V1::ResourcesController
        - resolve_feature (namespace + feature -> Registry lookup)
        - resolve_tool (HTTP method + scope + action -> Tool match)
        - execute_tool (Tool.execute with params)
                        |
                        v
            Core::Features::Registry
        - Maps namespace/feature to tools array
        - find_tool matches by http_method, scope, action
                        |
                        v
                  Tool Class
        ContactsService::Tools::Index < Core::Tools::Base
        - route (HTTP method, scope, action)
        - schema (data schema slug)
        - rswag (OpenAPI documentation)
        - execute(**params) -> Hash result
```

## Core::Tools::Base

**Location:** `packs/core/app/lib/core/tools/base.rb`

Base class for all tools. Inherits from `RubyLLM::Tool` for LLM compatibility.

### Class Methods

| Method              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `schema(slug)`      | Associates tool with a schema (e.g., `"contact"`) |
| `serializer(name)`  | Custom serializer (optional)                      |
| `schema_class`      | Returns the schema class from Registry            |
| `execute(**params)` | Entry point - instantiates and runs tool          |

### Instance Methods

| Method              | Description                                |
| ------------------- | ------------------------------------------ |
| `execute(**params)` | Main execution logic (must override)       |
| `workspace_id`      | Current workspace ID (injected)            |
| `user_id`           | Current user ID (injected)                 |
| `scoped(model)`     | Returns workspace-scoped query             |
| `items`             | Scoped items for this schema               |
| `find_item(id)`     | Find item by ID (returns nil if not found) |
| `find_item!(id)`    | Find item by ID (raises NotFoundError)     |

### Error Classes

| Class             | HTTP Status | Usage              |
| ----------------- | ----------- | ------------------ |
| `ValidationError` | 422         | Invalid input data |
| `NotFoundError`   | 404         | Resource not found |
| `ForbiddenError`  | 403         | Access denied      |

---

## Routing DSL

**Location:** `packs/core/app/lib/core/tools/routing.rb`

The `route` DSL determines whether a tool is exposed to API consumers:

- **With `route`**: HTTP endpoint exposed to API consumers, needs rswag request specs
- **Without `route`**: Internal/workflow-only, not exposed to API consumers, no rswag specs

```ruby
class MyTool < Core::Tools::Base
  route method: :get, scope: :collection           # GET /feature
  route method: :post, scope: :collection          # POST /feature
  route method: :get, scope: :member               # GET /feature/:id
  route method: :put, scope: :member               # PUT /feature/:id
  route method: :delete, scope: :member            # DELETE /feature/:id
  route method: :post, scope: :member, action: "cancel"  # POST /feature/:id/cancel
end

# Internal tool - no route, no HTTP endpoint
class InternalTool < Core::Tools::Base
  # No route - workflow only
  def execute(**params)
    # Called by other tools or workflows, not via HTTP
  end
end
```

| Option   | Values                                       | Description                                |
| -------- | -------------------------------------------- | ------------------------------------------ |
| `method` | `:get`, `:post`, `:put`, `:patch`, `:delete` | HTTP method                                |
| `scope`  | `:collection`, `:member`                     | Collection (no ID) or member (with ID)     |
| `action` | String                                       | Custom action name for non-CRUD operations |

---

## Standard Tool Patterns

### Index (List with Pagination)

```ruby
class Index < Core::Tools::Base
  route method: :get, scope: :collection
  schema "contact"
  description "List all contacts with pagination and search"

  def execute(page: 1, per_page: 25, search: nil, **filters)
    query = items.active
    query = query.where("data->>'first_name' ILIKE ?", "%#{search}%") if search.present?

    total = query.count
    records = query.order(created_at: :desc)
                   .offset((page.to_i - 1) * per_page.to_i)
                   .limit(per_page.to_i)

    {
      data: Core::Serializers::ItemSerializer.new(records).to_h,
      meta: { page: page.to_i, per_page: per_page.to_i, total:, total_pages: (total.to_f / per_page.to_i).ceil }
    }
  end
end
```

### Show

```ruby
class Show < Core::Tools::Base
  route method: :get, scope: :member
  schema "contact"

  def execute(id:, **_)
    item = find_item!(id)
    { data: Core::Serializers::ItemSerializer.new(item).to_h }
  end
end
```

### Create

```ruby
class Create < Core::Tools::Base
  route method: :post, scope: :collection
  schema "contact"
  params ContactSchema

  def execute(user_id:, workspace_id:, contact: {}, **_)
    validate!(contact)
    item = Item.create!(schema_slug: "contact", data: contact, created_by_id: user_id, workspace_id:)
    { data: Core::Serializers::ItemSerializer.new(item).to_h, meta: { created: true } }
  end
end
```

### Update

```ruby
class Update < Core::Tools::Base
  route method: :put, scope: :member
  schema "contact"
  params ContactSchema

  def execute(user_id:, id:, contact: {}, **_)
    item = find_item!(id)
    item.update!(data: item.data.merge(contact.stringify_keys), updated_by_id: user_id)
    { data: Core::Serializers::ItemSerializer.new(item).to_h, meta: { updated: true } }
  end
end
```

### Destroy (Soft Delete)

```ruby
class Destroy < Core::Tools::Base
  route method: :delete, scope: :member
  schema "contact"

  def execute(user_id:, id:, **_)
    item = find_item!(id)
    item.update!(deleted_at: Time.current, deleted_by_id: user_id)
    { meta: { deleted: true, id: } }
  end
end
```

### Custom Member Action

```ruby
class AddRelationship < Core::Tools::Base
  route method: :post, scope: :member, action: "relationships"
  schema "contact"

  def execute(id:, relationship_type:, target_id:, **_)
    source = find_item!(id)
    target = scoped(Item).find(target_id)
    relationship = source.add_relationship(target, relationship_type)
    { data: { id: relationship.id, source_id: source.id, target_id: target.id }, meta: { created: true } }
  end
end
```

---

## URL Patterns

Dynamic routing in `packs/core/config/routes/core.rb`:

```
GET    /api/v1/:namespace/:feature              -> index
POST   /api/v1/:namespace/:feature              -> create
GET    /api/v1/:namespace/:feature/:id          -> show
PUT    /api/v1/:namespace/:feature/:id          -> update
DELETE /api/v1/:namespace/:feature/:id          -> destroy
POST   /api/v1/:namespace/:feature/:id/:action  -> member_action
```

Examples:

- `GET /api/v1/workspaces/contacts` -> `ContactsService::Tools::Index`
- `POST /api/v1/workspaces/contacts/123/relationships` -> `ContactsService::Tools::AddRelationship`
