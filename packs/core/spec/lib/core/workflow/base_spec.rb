# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Workflow::Base do
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
      klass = Class.new(described_class) do
        workflow_file "custom_id"
      end
      stub_const("RibCheckWorkflow::Tools::Create", klass)

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

  describe ".workflow" do
    let(:workflow_path) { Rails.root.join("spec/fixtures/workflows/rib_check_create.yml") }

    before do
      FileUtils.mkdir_p(workflow_path.dirname)
      File.write(workflow_path, <<~YAML)
        id: rib_check_create
        name: RIB Check Create
        version: "1.0"
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

    it "returns workflow from registry" do
      stub_const("RibCheckWorkflow::Tools::Create", Class.new(described_class))

      workflow = RibCheckWorkflow::Tools::Create.workflow

      expect(workflow.id).to eq("rib_check_create")
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

      expect(result.status).to eq(:completed)
      expect(result.output).to include(success: true)
    end
  end
end
