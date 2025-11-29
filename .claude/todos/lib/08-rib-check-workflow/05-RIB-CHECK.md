# Phase 4: RIB Check Workflow

## Checklist

- [ ] Create rib_check_workflow pack structure
- [ ] Port RibRequest schema from CRM-REGTECH
- [ ] Create workflow YAML files (create, update, cancel)
- [ ] Create HTTP tools (with routes)
- [ ] Create views (index, form, show)
- [ ] Add to feature registry
- [ ] Add frontend route
- [ ] Write workflow integration tests

---

## 4.1 Pack Structure

```
packs/rib_check_workflow/
├── app/lib/rib_check_workflow/
│   ├── rib_request_schema.rb
│   ├── tools/
│   │   ├── index.rb
│   │   ├── show.rb
│   │   ├── create.rb
│   │   ├── update.rb
│   │   ├── destroy.rb
│   │   └── cancel.rb
│   ├── views/
│   │   ├── index.rb
│   │   ├── form.rb
│   │   └── show.rb
│   └── workflows/
│       ├── create.yml
│       ├── update.yml
│       └── cancel.yml
├── spec/
│   ├── lib/rib_check_workflow/
│   │   ├── rib_request_schema_spec.rb
│   │   ├── tools/
│   │   │   ├── create_spec.rb
│   │   │   ├── update_spec.rb
│   │   │   └── cancel_spec.rb
│   │   └── workflows/
│   │       ├── create_workflow_spec.rb
│   │       ├── update_workflow_spec.rb
│   │       └── cancel_workflow_spec.rb
│   └── requests/
│       └── rib_requests_spec.rb
└── package.yml
```

---

## 4.2 package.yml

```yaml
# packs/rib_check_workflow/package.yml
enforce_dependencies: true
enforce_privacy: true
dependencies:
  - packs/core
  - packs/ui
  - packs/items_service
  - packs/activities_service
  - packs/invites_service
```

---

## 4.3 Schema

```ruby
# packs/rib_check_workflow/app/lib/rib_check_workflow/rib_request_schema.rb
module RibCheckWorkflow
  class RibRequestSchema < Core::Schema::Base
    title "RIB Request"
    description "Request for bank account details (RIB) from contacts"

    # Fields
    string :comment, required: false, description: "Internal note"
    string :message_body, required: false, description: "Notification message"
    string :end_at, format: "date-time", required: false, description: "Deadline"
    boolean :notify_via_email, required: false, description: "Send email notification"
    boolean :notify_via_sms, required: false, description: "Send SMS notification"
    string :request_type, enum: %w[individual common], description: "Request type"
    string :status, enum: %w[draft pending partial completed cancelled], description: "Status"

    timestamps
    soft_delete

    # Relationships
    relationships do
      has_many :recipients, schema: :contact, inverse: :rib_requests
      has_many :documents, schema: :document, inverse: :rib_request
    end

    # Translations
    translations(
      en: {
        comment: "Internal Comment",
        message_body: "Message",
        end_at: "Deadline",
        notify_via_email: "Email Notification",
        notify_via_sms: "SMS Notification",
        request_type: "Request Type",
        status: "Status",
        recipients: "Recipients",
        documents: "Documents"
      },
      fr: {
        comment: "Commentaire interne",
        message_body: "Message",
        end_at: "Echéance",
        notify_via_email: "Notification Email",
        notify_via_sms: "Notification SMS",
        request_type: "Type de demande",
        status: "Statut",
        recipients: "Destinataires",
        documents: "Documents"
      }
    )
  end
end
```

---

## 4.4 Workflows

Workflow inputs are typed using JSON Schema. The `data` input references the full RibRequestSchema.

### Create Workflow

```yaml
# packs/rib_check_workflow/app/lib/rib_check_workflow/workflows/create.yml
id: rib_check_create
name: RIB Check Create
version: "1.0"
description: Create a RIB request with activity log and invites

inputs:
  workspace_id:
    type: integer
    required: true
    description: Workspace ID
  user_id:
    type: integer
    required: true
    description: User performing the action
  data:
    type: object
    required: true
    description: RIB request data
    properties:
      comment:
        type: string
      message_body:
        type: string
      end_at:
        type: string
        format: date-time
      notify_via_email:
        type: boolean
      notify_via_sms:
        type: boolean
      request_type:
        type: string
        enum: [individual, common]
      status:
        type: string
        enum: [draft, pending, partial, completed, cancelled]
      recipients_attributes:
        type: array
        items:
          type: object
          properties:
            id:
              type: integer
          required: [id]

steps:
  - id: start
    type: start
    next: create_item

  - id: create_item
    type: call
    service: ItemsService::Tools::Create
    method: execute
    input:
      user_id: "$input.user_id"
      workspace_id: "$input.workspace_id"
      schema_slug: "rib_request"
      tool_slug: "create"
      data: "$input.data"
    output: item
    next: create_activity

  - id: create_activity
    type: call
    service: ActivitiesService::Tools::Create
    method: execute
    input:
      user_id: "$input.user_id"
      workspace_id: "$input.workspace_id"
      activity_type: "user_action"
      category: "data_access"
      level: "info"
      message: "Created RIB request"
      item_id: "$item.id"
      schema_slug: "rib_request"
      tool_slug: "create"
    output: activity
    next: check_recipients

  - id: check_recipients
    type: router
    routes:
      - when:
          field: input.data.recipients_attributes
          op: exists
        then: create_invites
    default: end

  - id: create_invites
    type: loop
    over: "$input.data.recipients_attributes"
    as: recipient
    do:
      - id: create_invite
        type: call
        service: InvitesService::Tools::Create
        method: execute
        input:
          user_id: "$input.user_id"
          workspace_id: "$input.workspace_id"
          inviter_id: "$input.user_id"
          invitee_id: "$recipient.id"
          recipient_workspace_id: "$input.workspace_id"
          status: "pending"
          item_ids:
            - "$item.id"
    output: invites
    next: end

  - id: end
    type: end
    result:
      item: "$item"
      activity: "$activity"
      invites: "$invites"
```

### Update Workflow

```yaml
# packs/rib_check_workflow/app/lib/rib_check_workflow/workflows/update.yml
id: rib_check_update
name: RIB Check Update
version: "1.0"
description: Update a RIB request with activity log

inputs:
  workspace_id:
    type: integer
    required: true
    description: Workspace ID
  user_id:
    type: integer
    required: true
    description: User performing the action
  item_id:
    type: integer
    required: true
    description: RIB request item ID
  data:
    type: object
    required: true
    description: Updated RIB request data
    properties:
      comment:
        type: string
      message_body:
        type: string
      end_at:
        type: string
        format: date-time
      notify_via_email:
        type: boolean
      notify_via_sms:
        type: boolean
      request_type:
        type: string
        enum: [individual, common]
      status:
        type: string
        enum: [draft, pending, partial, completed, cancelled]

steps:
  - id: start
    type: start
    next: update_item

  - id: update_item
    type: call
    service: ItemsService::Tools::Update
    method: execute
    input:
      user_id: "$input.user_id"
      workspace_id: "$input.workspace_id"
      id: "$input.item_id"
      data: "$input.data"
    output: item
    next: create_activity

  - id: create_activity
    type: call
    service: ActivitiesService::Tools::Create
    method: execute
    input:
      user_id: "$input.user_id"
      workspace_id: "$input.workspace_id"
      activity_type: "user_action"
      category: "data_access"
      level: "info"
      message: "Updated RIB request"
      item_id: "$item.id"
      schema_slug: "rib_request"
      tool_slug: "update"
    output: activity
    next: end

  - id: end
    type: end
    result:
      item: "$item"
      activity: "$activity"
```

### Cancel Workflow

```yaml
# packs/rib_check_workflow/app/lib/rib_check_workflow/workflows/cancel.yml
id: rib_check_cancel
name: RIB Check Cancel
version: "1.0"
description: Cancel a RIB request with activity log

inputs:
  workspace_id:
    type: integer
    required: true
    description: Workspace ID
  user_id:
    type: integer
    required: true
    description: User performing the action
  item_id:
    type: integer
    required: true
    description: RIB request item ID

steps:
  - id: start
    type: start
    next: update_status

  - id: update_status
    type: call
    service: ItemsService::Tools::Update
    method: execute
    input:
      user_id: "$input.user_id"
      workspace_id: "$input.workspace_id"
      id: "$input.item_id"
      data:
        status: "cancelled"
    output: item
    next: create_activity

  - id: create_activity
    type: call
    service: ActivitiesService::Tools::Create
    method: execute
    input:
      user_id: "$input.user_id"
      workspace_id: "$input.workspace_id"
      activity_type: "user_action"
      category: "data_access"
      level: "info"
      message: "Cancelled RIB request"
      item_id: "$item.id"
      schema_slug: "rib_request"
      tool_slug: "cancel"
    output: activity
    next: end

  - id: end
    type: end
    result:
      item: "$item"
      activity: "$activity"
```

---

## 4.5 Tools (HTTP Interface)

### Create Tool

```ruby
# packs/rib_check_workflow/app/lib/rib_check_workflow/tools/create.rb
module RibCheckWorkflow
  module Tools
    class Create < Core::Tools::Base
      route method: :post, scope: :collection
      schema "rib_request"

      def execute(user_id:, workspace_id:, rib_request: {}, **_)
        workflow = DurableWorkflow.load(workflow_path(:create))
        runner = DurableWorkflow::Runners::Sync.new(workflow)

        result = runner.run(input: { user_id:, workspace_id:, data: rib_request })

        raise Core::Tools::ValidationError.new(result.error, {}) if result.failed?

        {
          data: Core::Serializers::ItemSerializer.new(Item.find(result.output["item"]["id"])).to_h,
          meta: { created: true }
        }
      end

      private

        def workflow_path(name)
          File.join(__dir__, "../workflows/#{name}.yml")
        end
    end
  end
end
```

### Update Tool

```ruby
# packs/rib_check_workflow/app/lib/rib_check_workflow/tools/update.rb
module RibCheckWorkflow
  module Tools
    class Update < Core::Tools::Base
      route method: :put, scope: :member
      schema "rib_request"

      def execute(user_id:, workspace_id:, id:, rib_request: {}, **_)
        item = find_item!(id)

        workflow = DurableWorkflow.load(workflow_path(:update))
        runner = DurableWorkflow::Runners::Sync.new(workflow)

        result = runner.run(input: { user_id:, workspace_id:, item_id: item.id, data: rib_request })

        raise Core::Tools::ValidationError.new(result.error, {}) if result.failed?

        {
          data: Core::Serializers::ItemSerializer.new(item.reload).to_h,
          meta: { updated: true }
        }
      end

      private

        def workflow_path(name)
          File.join(__dir__, "../workflows/#{name}.yml")
        end
    end
  end
end
```

### Cancel Tool

```ruby
# packs/rib_check_workflow/app/lib/rib_check_workflow/tools/cancel.rb
module RibCheckWorkflow
  module Tools
    class Cancel < Core::Tools::Base
      route method: :post, scope: :member, action: "cancel"
      schema "rib_request"

      def execute(user_id:, workspace_id:, id:, **_)
        item = find_item!(id)

        if item.data["status"] == "completed"
          raise Core::Tools::ValidationError.new(
            "Cannot cancel completed request",
            { status: "already completed" }
          )
        end

        workflow = DurableWorkflow.load(workflow_path(:cancel))
        runner = DurableWorkflow::Runners::Sync.new(workflow)

        result = runner.run(input: { user_id:, workspace_id:, item_id: item.id })

        raise Core::Tools::ValidationError.new(result.error, {}) if result.failed?

        {
          data: Core::Serializers::ItemSerializer.new(item.reload).to_h,
          meta: { cancelled: true }
        }
      end

      private

        def workflow_path(name)
          File.join(__dir__, "../workflows/#{name}.yml")
        end
    end
  end
end
```

### Index Tool

```ruby
# packs/rib_check_workflow/app/lib/rib_check_workflow/tools/index.rb
module RibCheckWorkflow
  module Tools
    class Index < Core::Tools::Base
      route method: :get, scope: :collection
      schema "rib_request"

      def execute(user_id:, workspace_id:, page: 1, per_page: 25, **_)
        query = items.where(workspace_id:).active

        total = query.count
        records = query.order(created_at: :desc)
                       .offset((page.to_i - 1) * per_page.to_i)
                       .limit(per_page.to_i)

        {
          data: Core::Serializers::ItemSerializer.new(records).to_h,
          meta: {
            page: page.to_i,
            per_page: per_page.to_i,
            total:,
            total_pages: (total.to_f / per_page.to_i).ceil
          }
        }
      end
    end
  end
end
```

### Show Tool

```ruby
# packs/rib_check_workflow/app/lib/rib_check_workflow/tools/show.rb
module RibCheckWorkflow
  module Tools
    class Show < Core::Tools::Base
      route method: :get, scope: :member
      schema "rib_request"

      def execute(user_id:, workspace_id:, id:, **_)
        item = find_item!(id)

        { data: Core::Serializers::ItemSerializer.new(item).to_h }
      end
    end
  end
end
```

### Destroy Tool

```ruby
# packs/rib_check_workflow/app/lib/rib_check_workflow/tools/destroy.rb
module RibCheckWorkflow
  module Tools
    class Destroy < Core::Tools::Base
      route method: :delete, scope: :member
      schema "rib_request"

      def execute(user_id:, workspace_id:, id:, **_)
        item = find_item!(id)

        item.update!(
          deleted_at: Time.current,
          deleted_by_id: user_id
        )

        { meta: { deleted: true, id: } }
      end
    end
  end
end
```

---

## 4.6 Feature Registry

```ruby
# Register RIB Check feature
Core::Features::Registry.register(
  namespace: :workspaces,
  feature: :rib_requests,
  schema: :rib_request,
  tools: [
    RibCheckWorkflow::Tools::Index,
    RibCheckWorkflow::Tools::Show,
    RibCheckWorkflow::Tools::Create,
    RibCheckWorkflow::Tools::Update,
    RibCheckWorkflow::Tools::Destroy,
    RibCheckWorkflow::Tools::Cancel
  ],
  views: [
    RibCheckWorkflow::Views::Index,
    RibCheckWorkflow::Views::Form,
    RibCheckWorkflow::Views::Show
  ]
)
```

---

## 4.7 Frontend Route

```tsx
// Add to router
{ path: "rib_requests/*", element: <FeaturePage feature="rib_request" /> }
```

---

## 4.8 Workflow Tests

Workflows must be fully tested. Test each workflow end-to-end.

### Create Workflow Spec

```ruby
# packs/rib_check_workflow/spec/lib/rib_check_workflow/workflows/create_workflow_spec.rb
require "rails_helper"

RSpec.describe "RibCheckWorkflow Create Workflow" do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:recipient1) { create(:user) }
  let(:recipient2) { create(:user) }

  let(:workflow_path) do
    File.join(
      RibCheckWorkflow::Engine.root,
      "app/lib/rib_check_workflow/workflows/create.yml"
    )
  end

  let(:workflow) { DurableWorkflow.load(workflow_path) }
  let(:runner) { DurableWorkflow::Runners::Sync.new(workflow) }

  before do
    Core::Schema::Registry.register(RibCheckWorkflow::RibRequestSchema)
  end

  describe "without recipients" do
    let(:input) do
      {
        user_id: user.id,
        workspace_id: workspace.id,
        data: {
          message_body: "Please provide your RIB",
          request_type: "individual",
          status: "draft"
        }
      }
    end

    it "creates an item" do
      expect { runner.run(input:) }.to change(Item, :count).by(1)
    end

    it "creates an activity" do
      expect { runner.run(input:) }.to change(Activity, :count).by(1)
    end

    it "does not create invites" do
      expect { runner.run(input:) }.not_to change(Invite, :count)
    end

    it "returns completed result" do
      result = runner.run(input:)

      expect(result.status).to eq("completed")
      expect(result.output["item"]).to be_present
      expect(result.output["activity"]).to be_present
    end

    it "stores correct item data" do
      runner.run(input:)

      item = Item.last
      expect(item.schema_slug).to eq("rib_request")
      expect(item.data["message_body"]).to eq("Please provide your RIB")
      expect(item.data["request_type"]).to eq("individual")
    end

    it "logs correct activity" do
      runner.run(input:)

      activity = Activity.last
      expect(activity.activity_type).to eq("user_action")
      expect(activity.message).to eq("Created RIB request")
      expect(activity.schema_slug).to eq("rib_request")
      expect(activity.tool_slug).to eq("create")
    end
  end

  describe "with recipients" do
    let(:input) do
      {
        user_id: user.id,
        workspace_id: workspace.id,
        data: {
          message_body: "Please provide your RIB",
          request_type: "common",
          status: "pending",
          recipients_attributes: [
            { id: recipient1.id },
            { id: recipient2.id }
          ]
        }
      }
    end

    it "creates invites for each recipient" do
      expect { runner.run(input:) }.to change(Invite, :count).by(2)
    end

    it "creates invite_items linking invites to the item" do
      expect { runner.run(input:) }.to change(InviteItem, :count).by(2)
    end

    it "returns invites in result" do
      result = runner.run(input:)

      expect(result.output["invites"]).to be_an(Array)
      expect(result.output["invites"].size).to eq(2)
    end

    it "sets correct invite attributes" do
      runner.run(input:)

      invite = Invite.last
      expect(invite.inviter_id).to eq(user.id)
      expect(invite.status).to eq("pending")
    end
  end

  describe "workflow execution records" do
    let(:input) do
      {
        user_id: user.id,
        workspace_id: workspace.id,
        data: { status: "draft" }
      }
    end

    it "creates a workflow execution" do
      expect { runner.run(input:) }.to change(WorkflowExecution, :count).by(1)
    end

    it "creates workflow entries for each step" do
      runner.run(input:)

      execution = WorkflowExecution.last
      expect(execution.workflow_entries.count).to be >= 3  # start, create_item, create_activity, end
    end

    it "marks execution as completed" do
      runner.run(input:)

      execution = WorkflowExecution.last
      expect(execution.status).to eq("completed")
    end
  end
end
```

### Update Workflow Spec

```ruby
# packs/rib_check_workflow/spec/lib/rib_check_workflow/workflows/update_workflow_spec.rb
require "rails_helper"

RSpec.describe "RibCheckWorkflow Update Workflow" do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:item) do
    create(:item,
      schema_slug: "rib_request",
      workspace: workspace,
      created_by: user,
      data: { status: "draft", message_body: "Original" }
    )
  end

  let(:workflow_path) do
    File.join(
      RibCheckWorkflow::Engine.root,
      "app/lib/rib_check_workflow/workflows/update.yml"
    )
  end

  let(:workflow) { DurableWorkflow.load(workflow_path) }
  let(:runner) { DurableWorkflow::Runners::Sync.new(workflow) }

  let(:input) do
    {
      user_id: user.id,
      workspace_id: workspace.id,
      item_id: item.id,
      data: { status: "pending", message_body: "Updated message" }
    }
  end

  it "updates the item" do
    runner.run(input:)

    item.reload
    expect(item.data["status"]).to eq("pending")
    expect(item.data["message_body"]).to eq("Updated message")
  end

  it "creates an activity" do
    expect { runner.run(input:) }.to change(Activity, :count).by(1)
  end

  it "logs update activity" do
    runner.run(input:)

    activity = Activity.last
    expect(activity.message).to eq("Updated RIB request")
    expect(activity.tool_slug).to eq("update")
  end

  it "returns completed result" do
    result = runner.run(input:)

    expect(result.status).to eq("completed")
    expect(result.output["item"]["id"]).to eq(item.id)
  end
end
```

### Cancel Workflow Spec

```ruby
# packs/rib_check_workflow/spec/lib/rib_check_workflow/workflows/cancel_workflow_spec.rb
require "rails_helper"

RSpec.describe "RibCheckWorkflow Cancel Workflow" do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:item) do
    create(:item,
      schema_slug: "rib_request",
      workspace: workspace,
      created_by: user,
      data: { status: "pending" }
    )
  end

  let(:workflow_path) do
    File.join(
      RibCheckWorkflow::Engine.root,
      "app/lib/rib_check_workflow/workflows/cancel.yml"
    )
  end

  let(:workflow) { DurableWorkflow.load(workflow_path) }
  let(:runner) { DurableWorkflow::Runners::Sync.new(workflow) }

  let(:input) do
    {
      user_id: user.id,
      workspace_id: workspace.id,
      item_id: item.id
    }
  end

  it "updates status to cancelled" do
    runner.run(input:)

    item.reload
    expect(item.data["status"]).to eq("cancelled")
  end

  it "creates an activity" do
    expect { runner.run(input:) }.to change(Activity, :count).by(1)
  end

  it "logs cancel activity" do
    runner.run(input:)

    activity = Activity.last
    expect(activity.message).to eq("Cancelled RIB request")
    expect(activity.tool_slug).to eq("cancel")
  end

  it "returns completed result" do
    result = runner.run(input:)

    expect(result.status).to eq("completed")
    expect(result.output["item"]["data"]["status"]).to eq("cancelled")
  end
end
```

---

## Summary

| Component | Files                                                                           |
| --------- | ------------------------------------------------------------------------------- |
| Schema    | `rib_request_schema.rb`                                                         |
| Workflows | `create.yml`, `update.yml`, `cancel.yml`                                        |
| Tools     | `index.rb`, `show.rb`, `create.rb`, `update.rb`, `destroy.rb`, `cancel.rb`      |
| Views     | `index.rb`, `form.rb`, `show.rb`                                                |
| Tests     | `create_workflow_spec.rb`, `update_workflow_spec.rb`, `cancel_workflow_spec.rb` |

**Pattern**: HTTP tools trigger workflows → workflows call service tools → full audit trail via WorkflowExecution/WorkflowEntry.

**Note**: `cancel_pending_invites` functionality will be handled elsewhere (not in this pack).
