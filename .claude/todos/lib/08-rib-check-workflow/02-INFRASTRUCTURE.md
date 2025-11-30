# Phase 2: Infrastructure

## Checklist

- [ ] Add gem to Gemfile
- [ ] Create migration for workflow tables
- [ ] Create WorkflowExecution model
- [ ] Create WorkflowEntry model
- [ ] Create initializer
- [ ] Refactor Core::Tools::Base (new pattern)
- [ ] Update ResourcesController

---

## 2.1 Gemfile

```ruby
# Gemfile
gem 'durable_workflow', github: 'getnvoi/durable_workflows', branch: 'main'
```

Local override (already done):

```bash
bundle config local.durable_workflow /Users/ben/Desktop/durable_workflow
```

---

## 2.2 Migration

```ruby
# db/migrate/XXXXXX_create_workflow_tables.rb
class CreateWorkflowTables < ActiveRecord::Migration[8.0]
  def change
    create_table :workflow_executions, id: :uuid do |t|
      t.string :workflow_id, null: false
      t.string :status, null: false, default: 'running'
      t.jsonb :input, default: {}
      t.jsonb :ctx, default: {}
      t.string :current_step
      t.jsonb :result
      t.string :recover_to
      t.jsonb :halt_data
      t.text :error
      t.timestamps

      t.index :workflow_id
      t.index :status
      t.index :created_at
    end

    create_table :workflow_entries, id: :uuid do |t|
      t.uuid :execution_id, null: false
      t.string :step_id, null: false
      t.string :step_type, null: false
      t.string :action, null: false  # started, completed, failed, halted
      t.integer :duration_ms
      t.jsonb :input
      t.jsonb :output
      t.text :error
      t.datetime :timestamp, null: false

      t.index :execution_id
      t.index :step_id
      t.index :timestamp
    end

    add_foreign_key :workflow_entries, :workflow_executions,
                    column: :execution_id, primary_key: :id
  end
end
```

---

## 2.3 Models

```ruby
# app/models/workflow_execution.rb
class WorkflowExecution < ApplicationRecord
  has_many :workflow_entries, foreign_key: :execution_id, dependent: :destroy

  STATUSES = %w[running completed failed halted].freeze

  validates :workflow_id, presence: true
  validates :status, presence: true, inclusion: { in: STATUSES }

  scope :running, -> { where(status: 'running') }
  scope :completed, -> { where(status: 'completed') }
  scope :failed, -> { where(status: 'failed') }
  scope :halted, -> { where(status: 'halted') }
end
```

```ruby
# app/models/workflow_entry.rb
class WorkflowEntry < ApplicationRecord
  belongs_to :workflow_execution, foreign_key: :execution_id

  ACTIONS = %w[started completed failed halted].freeze

  validates :step_id, presence: true
  validates :step_type, presence: true
  validates :action, presence: true, inclusion: { in: ACTIONS }
  validates :timestamp, presence: true
end
```

---

## 2.4 Initializer

```ruby
# config/initializers/durable_workflow.rb
require 'durable_workflow'
require 'durable_workflow/storage/active_record'

Rails.application.config.after_initialize do
  DurableWorkflow.configure do |c|
    c.store = DurableWorkflow::Storage::ActiveRecord.new(
      execution_class: WorkflowExecution,
      entry_class: WorkflowEntry
    )

    c.logger = Rails.logger
  end
end
```

---

## 2.5 Refactor Core::Tools::Base

New pattern: class method `execute` calls instance method `execute`. No context object. Explicit params.

```ruby
# packs/core/app/lib/core/tools/base.rb
module Core
  module Tools
    class Base
      include Routing

      class << self
        attr_reader :schema_slug, :serializer_name

        def schema(slug)
          @schema_slug = slug.to_s
        end

        def serializer(name)
          @serializer_name = name
        end

        def schema_class
          Schema::Registry.find(schema_slug)
        end

        # Entry point - called by controller and workflows
        def execute(**params)
          new.execute(**params)
        end
      end

      # Subclasses override this
      def execute(**params)
        raise NotImplementedError, "#{self.class.name}#execute must be implemented"
      end
    end

    class ValidationError < StandardError
      attr_reader :details
      def initialize(message, details = {})
        super(message)
        @details = details
      end
    end

    class NotFoundError < StandardError; end
    class ForbiddenError < StandardError; end
  end
end
```

---

## 2.6 Update ResourcesController

Controller calls `execute` directly with explicit user_id/workspace_id.

```ruby
# packs/core/app/controllers/core/v1/resources_controller.rb
module Core
  module V1
    class ResourcesController < ApplicationController
      before_action :resolve_feature
      before_action :resolve_tool

      def index = execute_tool
      def create = execute_tool
      def show = execute_tool
      def update = execute_tool
      def destroy = execute_tool
      def collection_action = execute_tool
      def member_action = execute_tool

      private

        def resolve_feature
          @feature = Features::Registry.find(params[:namespace], params[:feature])
          head :not_found unless @feature
        end

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

        def execute_tool
          result = @tool_class.execute(
            user_id: current_user.id,
            workspace_id: current_workspace.id,
            **tool_params
          )
          render json: result
        rescue Core::Tools::ValidationError => e
          render json: { error: e.message, details: e.details }, status: :unprocessable_content
        rescue Core::Tools::NotFoundError => e
          render json: { error: e.message }, status: :not_found
        rescue Core::Tools::ForbiddenError => e
          render json: { error: e.message }, status: :forbidden
        rescue StandardError => e
          render json: { error: e.class.name, message: e.message }, status: :internal_server_error
        end

        def tool_params
          params.permit!.to_h.symbolize_keys.except(
            :namespace, :feature, :action_name, :controller, :action, :format
          )
        end
    end
  end
end
```

---

## 2.7 Tool Example (Updated Pattern)

```ruby
# packs/contacts_service/app/lib/contacts_service/tools/create.rb
module ContactsService
  module Tools
    class Create < Core::Tools::Base
      route method: :post, scope: :collection
      schema "contact"

      def execute(user_id:, workspace_id:, contact: {}, **_)
        validate!(contact)

        item = Item.create!(
          schema_slug: "contact",
          tool_slug: "create",
          data: contact,
          created_by_id: user_id,
          workspace_id: workspace_id
        )

        { data: Core::Serializers::ItemSerializer.new(item).to_h, meta: { created: true } }
      end

      private

        def validate!(data)
          data = data.to_h.with_indifferent_access
          errors = {}
          errors[:first_name] = "is required" if data[:first_name].blank?
          errors[:last_name] = "is required" if data[:last_name].blank?
          raise Core::Tools::ValidationError.new("Validation failed", errors) if errors.any?
        end
    end
  end
end
```

---

## 2.8 Workflow Usage

Workflows call tools directly. No adapter needed.

```yaml
- id: create_contact
  type: call
  service: ContactsService::Tools::Create
  method: execute
  input:
    user_id: "$input.user_id"
    workspace_id: "$input.workspace_id"
    contact: "$input.contact_data"
  output: contact
```

The gem calls `ContactsService::Tools::Create.execute(**input)` which does `new.execute(**input)`.

---

## File Checklist

```
db/migrate/XXXXXX_create_workflow_tables.rb
app/models/workflow_execution.rb
app/models/workflow_entry.rb
config/initializers/durable_workflow.rb
packs/core/app/lib/core/tools/base.rb (refactor)
packs/core/app/controllers/core/v1/resources_controller.rb (update)
```
