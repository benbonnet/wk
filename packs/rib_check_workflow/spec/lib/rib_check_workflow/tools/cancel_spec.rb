# frozen_string_literal: true

require "rails_helper"

RSpec.describe RibCheckWorkflow::Tools::Cancel do
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

  before do
    Core::Schema::Registry.clear!
    Core::Schema::Registry.register(RibCheckWorkflow::RibRequestSchema)
    Core::Workflow::Registry.clear!

    # Register workflows
    workflow_dir = Rails.root.join("packs/rib_check_workflow/app/lib/rib_check_workflow/workflows")
    Dir["#{workflow_dir}/*.yml"].each do |path|
      Core::Workflow::Registry.register(path)
    end
  end

  describe ".workflow_id" do
    it "infers workflow ID from class name" do
      expect(described_class.workflow_id).to eq("rib_check_cancel")
    end
  end

  describe ".execute" do
    let(:params) do
      {
        user_id: user.id,
        workspace_id: workspace.id,
        id: item.id
      }
    end

    it "cancels the item via workflow" do
      described_class.execute(**params)

      item.reload
      expect(item.data["status"]).to eq("cancelled")
    end

    it "creates an activity via workflow" do
      expect { described_class.execute(**params) }.to change(Activity, :count).by(1)
    end

    it "returns serialized item with meta" do
      result = described_class.execute(**params)

      expect(result).to have_key(:data)
      expect(result).to have_key(:meta)
      expect(result[:meta][:cancelled]).to be true
    end

    it "raises NotFoundError for unknown item" do
      params[:id] = 99999

      expect { described_class.execute(**params) }
        .to raise_error(Core::Tools::NotFoundError)
    end

    context "when item is already completed" do
      before { item.update!(data: { "status" => "completed" }) }

      it "raises ValidationError" do
        expect { described_class.execute(**params) }
          .to raise_error(Core::Tools::ValidationError, "Cannot cancel completed request")
      end
    end
  end

  describe "routing" do
    it { expect(described_class.route_config).to include(method: :post, scope: :member, action: "cancel") }
  end

  describe "schema" do
    it { expect(described_class.schema_slug).to eq("rib_request") }
  end
end
