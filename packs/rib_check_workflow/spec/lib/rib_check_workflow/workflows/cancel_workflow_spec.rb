# frozen_string_literal: true

require "rails_helper"

RSpec.describe "RibCheckWorkflow Cancel Workflow" do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:item) do
    create(:item,
      schema_slug: "rib_request",
      workspace:,
      created_by: user,
      data: { "status" => "pending" }
    )
  end

  let(:workflow_path) do
    Rails.root.join("packs/rib_check_workflow/app/lib/rib_check_workflow/workflows/cancel.yml")
  end

  let(:workflow) { DurableWorkflow.load(workflow_path.to_s) }
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

    expect(result.status).to eq(:completed)
    expect(result.output[:item][:data][:status]).to eq("cancelled")
  end

  it "creates a workflow execution" do
    expect { runner.run(input:) }.to change(WorkflowExecution, :count).by(1)
  end

  it "marks execution as completed" do
    runner.run(input:)

    execution = WorkflowExecution.last
    expect(execution.status).to eq("completed")
  end
end
