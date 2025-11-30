# Phase 4: Core Workflow Base

## Checklist

- [ ] Create Core::Workflow::Base class
- [ ] Create Core::Workflow::Registry
- [ ] Add initializer to load workflows at boot
- [ ] Write tests for Base and Registry

---

## 4.1 Core::Workflow::Base

Extends `Core::Tools::Base` with workflow conventions. Tools that trigger workflows inherit from this.

```ruby
# packs/core/app/lib/core/workflow/base.rb
module Core
  module Workflow
    class Base < Core::Tools::Base
      class << self
        attr_reader :workflow_id_override

        # Explicit workflow ID (optional)
        def workflow_file(id)
          @workflow_id_override = id
        end

        # Inferred from class name
        # RibCheckWorkflow::Tools::Create => rib_check_create
        def inferred_workflow_id
          return nil unless name

          # RibCheckWorkflow::Tools::Create => ["RibCheckWorkflow", "Tools", "Create"]
          parts = name.split("::")
          return nil unless parts.size >= 3

          pack_name = parts[0].underscore.sub(/_workflow$/, "")  # rib_check_workflow => rib_check
          action = parts.last.underscore                          # Create => create

          "#{pack_name}_#{action}"
        end

        def workflow_id
          @workflow_id_override || inferred_workflow_id
        end

        def workflow
          Registry.find(workflow_id)
        end
      end

      def run_workflow(input:)
        runner = DurableWorkflow::Runners::Sync.new(self.class.workflow)
        result = runner.run(input:)

        raise Core::Tools::ValidationError.new(result.error, {}) if result.failed?

        result
      end
    end

    class WorkflowNotFoundError < StandardError; end
  end
end
```

---

## 4.2 Core::Workflow::Registry

Loads and caches workflows. Conventioned workflows loaded at boot, custom lazy-loaded.

```ruby
# packs/core/app/lib/core/workflow/registry.rb
module Core
  module Workflow
    class Registry
      class << self
        def workflows
          @workflows ||= {}
        end

        def register(path)
          wf = DurableWorkflow.load(path.to_s)
          workflows[wf.id] = wf
          wf
        end

        def find(id)
          workflows[id] || raise(WorkflowNotFoundError, "Workflow not found: #{id}")
        end

        def find_or_register(id, path)
          workflows[id] ||= register(path)
        end

        # Load all conventioned workflows at boot
        def load_all!
          Rails.root.glob("packs/**/workflows/*.yml").each do |path|
            register(path)
          end
        end

        def clear!
          @workflows = {}
        end

        def registered_ids
          workflows.keys
        end
      end
    end
  end
end
```

---

## 4.3 Initializer

```ruby
# config/initializers/workflows.rb
Rails.application.config.after_initialize do
  Core::Workflow::Registry.load_all!
end
```

---

## 4.4 Usage

### Convention-based (inferred workflow ID)

```ruby
# packs/rib_check_workflow/app/lib/rib_check_workflow/tools/create.rb
# Workflow file: packs/rib_check_workflow/app/lib/rib_check_workflow/workflows/create.yml
# Workflow ID in YAML: rib_check_create

module RibCheckWorkflow
  module Tools
    class Create < Core::Workflow::Base
      description "Create a RIB request"
      route method: :post, scope: :collection
      schema "rib_request"

      param :user_id, type: :string, desc: "Current user ID"
      param :workspace_id, type: :string, desc: "Workspace ID"
      param :rib_request, type: :object, desc: "RIB request data"

      # Inferred workflow_id: rib_check_create

      def execute(user_id:, workspace_id:, rib_request: {}, **_)
        result = run_workflow(input: { user_id:, workspace_id:, data: rib_request })

        {
          data: Core::Serializers::ItemSerializer.new(Item.find(result.output["item"]["id"])).to_h,
          meta: { created: true }
        }
      end
    end
  end
end
```

### Explicit workflow ID (override)

```ruby
class SomeCustomTool < Core::Workflow::Base
  workflow_file "custom_workflow_id"  # Must match `id:` in the YAML

  def execute(**)
    result = run_workflow(input: { ... })
    # ...
  end
end
```

---

## 4.5 Workflow YAML Convention

Workflow ID must match the convention: `{pack_name}_{action}`

```yaml
# packs/rib_check_workflow/app/lib/rib_check_workflow/workflows/create.yml
id: rib_check_create # Must match inferred ID
name: RIB Check Create
version: "1.0"

inputs:
  # ...

steps:
  # ...
```

---

## 4.6 File Structure

```
packs/core/app/lib/core/workflow/
├── base.rb
└── registry.rb

config/initializers/
└── workflows.rb
```

---

## Summary

| Component                  | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `Core::Workflow::Base`     | Base class for tools that trigger workflows |
| `Core::Workflow::Registry` | Loads and caches workflow definitions       |
| `workflow_file`            | Override inferred workflow ID               |
| `run_workflow`             | Execute workflow and handle errors          |
| `load_all!`                | Preload conventioned workflows at boot      |

**Convention**:

- Workflow file: `packs/{pack}/app/lib/{pack}/workflows/{action}.yml`
- Workflow ID: `{pack_name}_{action}` (e.g., `rib_check_create`)
- Pack name derived from module: `RibCheckWorkflow` → `rib_check`

---

## 4.7 Tests

### Registry Spec

```ruby
# packs/core/spec/lib/core/workflow/registry_spec.rb
require "rails_helper"

RSpec.describe Core::Workflow::Registry do
  let(:workflow_path) { Rails.root.join("spec/fixtures/workflows/test_workflow.yml") }

  before do
    described_class.clear!

    # Create fixture workflow
    FileUtils.mkdir_p(workflow_path.dirname)
    File.write(workflow_path, <<~YAML)
      id: test_workflow
      name: Test Workflow
      version: "1.0"
      steps:
        - id: start
          type: start
          next: end
        - id: end
          type: end
          result: {}
    YAML
  end

  after do
    FileUtils.rm_rf(workflow_path.dirname)
    described_class.clear!
  end

  describe ".register" do
    it "loads and caches the workflow" do
      workflow = described_class.register(workflow_path)

      expect(workflow.id).to eq("test_workflow")
      expect(described_class.registered_ids).to include("test_workflow")
    end
  end

  describe ".find" do
    context "when workflow is registered" do
      before { described_class.register(workflow_path) }

      it "returns the workflow" do
        workflow = described_class.find("test_workflow")

        expect(workflow.id).to eq("test_workflow")
      end
    end

    context "when workflow is not registered" do
      it "raises WorkflowNotFoundError" do
        expect { described_class.find("nonexistent") }
          .to raise_error(Core::Workflow::WorkflowNotFoundError, /nonexistent/)
      end
    end
  end

  describe ".load_all!" do
    it "loads all workflows from packs/**/workflows/*.yml" do
      # This test depends on actual workflow files in packs
      described_class.load_all!

      # Should not raise, workflows loaded
      expect(described_class.registered_ids).to be_an(Array)
    end
  end

  describe ".clear!" do
    before { described_class.register(workflow_path) }

    it "removes all cached workflows" do
      expect(described_class.registered_ids).not_to be_empty

      described_class.clear!

      expect(described_class.registered_ids).to be_empty
    end
  end
end
```

### Base Spec

```ruby
# packs/core/spec/lib/core/workflow/base_spec.rb
require "rails_helper"

RSpec.describe Core::Workflow::Base do
  before { Core::Workflow::Registry.clear! }

  describe ".inferred_workflow_id" do
    it "infers workflow ID from class name" do
      stub_const("RibCheckWorkflow::Tools::Create", Class.new(described_class))

      expect(RibCheckWorkflow::Tools::Create.inferred_workflow_id).to eq("rib_check_create")
    end

    it "handles Update action" do
      stub_const("RibCheckWorkflow::Tools::Update", Class.new(described_class))

      expect(RibCheckWorkflow::Tools::Update.inferred_workflow_id).to eq("rib_check_update")
    end

    it "handles Cancel action" do
      stub_const("RibCheckWorkflow::Tools::Cancel", Class.new(described_class))

      expect(RibCheckWorkflow::Tools::Cancel.inferred_workflow_id).to eq("rib_check_cancel")
    end

    it "strips _workflow suffix from pack name" do
      stub_const("SomeFeatureWorkflow::Tools::Create", Class.new(described_class))

      expect(SomeFeatureWorkflow::Tools::Create.inferred_workflow_id).to eq("some_feature_create")
    end

    it "returns nil for anonymous classes" do
      anon_class = Class.new(described_class)

      expect(anon_class.inferred_workflow_id).to be_nil
    end
  end

  describe ".workflow_file" do
    it "overrides inferred workflow ID" do
      stub_const("RibCheckWorkflow::Tools::Create", Class.new(described_class) do
        workflow_file "custom_id"
      end)

      expect(RibCheckWorkflow::Tools::Create.workflow_id).to eq("custom_id")
    end
  end

  describe ".workflow_id" do
    it "returns override if set" do
      klass = Class.new(described_class) do
        workflow_file "override_id"
      end

      expect(klass.workflow_id).to eq("override_id")
    end

    it "returns inferred ID if no override" do
      stub_const("RibCheckWorkflow::Tools::Create", Class.new(described_class))

      expect(RibCheckWorkflow::Tools::Create.workflow_id).to eq("rib_check_create")
    end
  end

  describe "#run_workflow" do
    let(:user) { create(:user) }
    let(:workspace) { create(:workspace) }
    let(:workflow_path) { Rails.root.join("spec/fixtures/workflows/test_create.yml") }

    before do
      FileUtils.mkdir_p(workflow_path.dirname)
      File.write(workflow_path, <<~YAML)
        id: test_create
        name: Test Create
        version: "1.0"
        inputs:
          user_id:
            type: integer
            required: true
          workspace_id:
            type: integer
            required: true
        steps:
          - id: start
            type: start
            next: end
          - id: end
            type: end
            result:
              success: true
      YAML

      Core::Workflow::Registry.register(workflow_path)
    end

    after do
      FileUtils.rm_rf(workflow_path.dirname)
    end

    it "executes the workflow and returns result" do
      klass = Class.new(described_class) do
        workflow_file "test_create"
      end

      tool = klass.new
      result = tool.run_workflow(input: { user_id: user.id, workspace_id: workspace.id })

      expect(result.status).to eq("completed")
      expect(result.output["success"]).to be true
    end

    it "raises ValidationError on workflow failure" do
      # Register a failing workflow
      fail_path = Rails.root.join("spec/fixtures/workflows/test_fail.yml")
      File.write(fail_path, <<~YAML)
        id: test_fail
        name: Test Fail
        version: "1.0"
        steps:
          - id: start
            type: start
            next: fail_step
          - id: fail_step
            type: call
            service: NonExistentService
            method: fail
            input: {}
            output: result
            next: end
          - id: end
            type: end
            result: {}
      YAML

      Core::Workflow::Registry.register(fail_path)

      klass = Class.new(described_class) do
        workflow_file "test_fail"
      end

      tool = klass.new

      expect { tool.run_workflow(input: {}) }
        .to raise_error(Core::Tools::ValidationError)
    end
  end
end
```
