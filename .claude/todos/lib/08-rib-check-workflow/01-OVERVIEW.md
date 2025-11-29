# RIB Check Workflow Integration - Overview

## What We're Building

Integrate `durable_workflow` gem into the Rails app to orchestrate multi-side-effect actions. First use case: RIB Check (RIB Request) feature.

## durable_workflow Gem

**Location**: `/Users/ben/Desktop/durable_workflow`
**Link**: `bundle config local.durable_workflow /Users/ben/Desktop/durable_workflow`

### Core Concepts

- YAML-defined workflows with typed steps
- Step types: `start`, `end`, `assign`, `call`, `router`, `loop`, `parallel`, `halt`, `approval`
- Variable resolution: `$input.field`, `$ctx.variable`, `$now`
- Storage: ActiveRecord (we'll use this), Redis, Sequel
- Runners: Sync, Async, Stream

### Call Step Pattern

```yaml
- id: do_something
  type: call
  service: MyModule::Tools::MyTool
  method: execute
  input:
    user_id: "$input.user_id"
    workspace_id: "$input.workspace_id"
    foo: "$input.foo"
  output: result
  next: next_step
```

The gem calls `MyModule::Tools::MyTool.execute(**input)` which does `new.execute(**input)`.

**Critical**: Tools must return **hashes** (not AR objects) for JSON serialization.

## Tool Pattern

**Single entry point**: `execute`

```ruby
class Base
  class << self
    def execute(**params)
      new.execute(**params)
    end
  end

  def execute(**params)
    raise NotImplementedError
  end
end
```

**Tool example**:

```ruby
class Create < Core::Tools::Base
  route method: :post, scope: :collection  # Optional - some tools are workflow-only
  schema "contact"

  def execute(user_id:, workspace_id:, contact: {}, **_)
    # All params explicit - no hidden context
    item = Item.create!(
      schema_slug: "contact",
      tool_slug: "create",
      data: contact,
      created_by_id: user_id,
      workspace_id: workspace_id
    )

    { data: Core::Serializers::ItemSerializer.new(item).to_h, meta: { created: true } }
  end
end
```

**Controller calls**:

```ruby
@tool_class.execute(
  user_id: current_user.id,
  workspace_id: current_workspace.id,
  **tool_params
)
```

**Workflow calls** (same thing):

```yaml
service: ContactsService::Tools::Create
method: execute
input:
  user_id: "$input.user_id"
  workspace_id: "$input.workspace_id"
  contact: "$input.contact_data"
```

No adapters. No context objects. Explicit params everywhere.

## RIB Request Feature (from CRM-REGTECH)

### Schema: `rib_request`

Fields:

- `comment` - internal note
- `message_body` - notification message
- `end_at` - deadline (datetime)
- `notify_via_email`, `notify_via_sms` - boolean flags
- `request_type` - "individual" | "common"
- `status` - "draft" → "pending" → "partial" → "completed" | "cancelled"

Relationships:

- `recipients` → contacts (has_many)
- `documents` → documents (has_many)

### Workflow Side Effects

**On Create:**

1. Create Item (rib_request record)
2. Create Activity (audit log)
3. Create Invite per recipient
4. (Future) Send notifications

**On Update:**

1. Update Item
2. Create Activity
3. Handle recipient changes (add/remove invites)

**On Cancel:**

1. Update Item status
2. Create Activity
3. Cancel pending invites

## Philosophy

**Any action with multiple side effects = workflow.**

- No `track_activity` callbacks
- No scattered side effects in `execute` methods
- All effects declared explicitly in workflow YAML
- Full audit trail via workflow entries

## Phase Documents

- **02-INFRASTRUCTURE.md** - Migration, models, initializer, refactor Core::Tools::Base, update controller
- **03-SERVICES.md** - activities_service, invites_service, items_service packs (tools, serializers)
- **04-RIB-CHECK.md** - rib_check_service pack with workflows
