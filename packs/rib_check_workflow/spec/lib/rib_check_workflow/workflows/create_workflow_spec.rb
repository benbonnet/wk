# frozen_string_literal: true

require "rails_helper"

RSpec.describe "RibCheckWorkflow Create Workflow" do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:recipient1) { create(:user) }
  let(:recipient2) { create(:user) }

  let(:workflow_path) do
    Rails.root.join("packs/rib_check_workflow/app/lib/rib_check_workflow/workflows/create.yml")
  end

  let(:workflow) { DurableWorkflow.load(workflow_path.to_s) }
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

      expect(result.status).to eq(:completed)
      expect(result.output[:item]).to be_present
      expect(result.output[:activity]).to be_present
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

      expect(result.output[:invites]).to be_an(Array)
      expect(result.output[:invites].size).to eq(2)
    end

    it "sets correct invite attributes" do
      runner.run(input:)

      invite = Invite.last
      expect(invite.inviter_id).to eq(user.id)
      expect(invite.status).to eq("pending")
    end
  end

  describe "when a step fails" do
    let(:input) do
      {
        user_id: user.id,
        workspace_id: workspace.id,
        data: { request_type: "individual", status: "draft" }
      }
    end

    it "raises the error" do
      allow(ItemsService::Tools::Create).to receive(:execute).and_raise(StandardError, "DB connection lost")

      expect { runner.run(input:) }.to raise_error(StandardError, "DB connection lost")
    end

    it "marks execution as failed" do
      allow(ItemsService::Tools::Create).to receive(:execute).and_raise(StandardError, "DB connection lost")

      expect { runner.run(input:) }.to raise_error(StandardError)

      execution = WorkflowExecution.last
      expect(execution.status).to eq("failed")
      expect(execution.error).to include("DB connection lost")
    end

    it "records the failed step in entries" do
      allow(ItemsService::Tools::Create).to receive(:execute).and_raise(StandardError, "DB connection lost")

      expect { runner.run(input:) }.to raise_error(StandardError)

      execution = WorkflowExecution.last
      failed_entry = execution.workflow_entries.find { |e| e.action == "failed" }

      expect(failed_entry).to be_present
      expect(failed_entry.step_id).to eq("create_item")
      expect(failed_entry.error).to include("DB connection lost")
    end

    it "does not create subsequent records when early step fails" do
      allow(ItemsService::Tools::Create).to receive(:execute).and_raise(StandardError, "boom")

      expect { runner.run(input:) }.to raise_error(StandardError)

      expect(Item.count).to eq(0)
      expect(Activity.count).to eq(0)
    end
  end

  describe "workflow execution records" do
    let(:input) do
      {
        user_id: user.id,
        workspace_id: workspace.id,
        data: { request_type: "individual", status: "draft" }
      }
    end

    it "creates a workflow execution" do
      expect { runner.run(input:) }.to change(WorkflowExecution, :count).by(1)
    end

    it "creates workflow entries for each step" do
      runner.run(input:)

      execution = WorkflowExecution.last
      expect(execution.workflow_entries.count).to be >= 3
    end

    it "marks execution as completed" do
      runner.run(input:)

      execution = WorkflowExecution.last
      expect(execution.status).to eq("completed")
    end
  end
end
