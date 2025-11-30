# frozen_string_literal: true

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

  describe ".find_or_register" do
    it "returns existing workflow if already registered" do
      described_class.register(workflow_path)

      workflow = described_class.find_or_register("test_workflow", workflow_path)

      expect(workflow.id).to eq("test_workflow")
    end

    it "registers and returns workflow if not found" do
      workflow = described_class.find_or_register("test_workflow", workflow_path)

      expect(workflow.id).to eq("test_workflow")
      expect(described_class.registered_ids).to include("test_workflow")
    end
  end
end
