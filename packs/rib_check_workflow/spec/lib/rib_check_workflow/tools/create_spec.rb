# frozen_string_literal: true

require "rails_helper"

RSpec.describe RibCheckWorkflow::Tools::Create do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }

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
      expect(described_class.workflow_id).to eq("rib_check_create")
    end
  end

  describe ".execute" do
    let(:params) do
      {
        user_id: user.id,
        workspace_id: workspace.id,
        rib_request: {
          message_body: "Please provide your RIB",
          request_type: "individual",
          status: "draft"
        }
      }
    end

    it "creates an item via workflow" do
      expect { described_class.execute(**params) }.to change(Item, :count).by(1)
    end

    it "creates an activity via workflow" do
      expect { described_class.execute(**params) }.to change(Activity, :count).by(1)
    end

    it "returns serialized item with meta" do
      result = described_class.execute(**params)

      expect(result).to have_key(:data)
      expect(result).to have_key(:meta)
      expect(result[:meta][:created]).to be true
    end

    it "stores correct item data" do
      described_class.execute(**params)

      item = Item.last
      expect(item.schema_slug).to eq("rib_request")
      expect(item.data["message_body"]).to eq("Please provide your RIB")
    end

    context "with recipients" do
      let(:recipient) { create(:user) }
      let(:params_with_recipients) do
        params.deep_merge(
          rib_request: {
            recipients_attributes: [{ id: recipient.id }]
          }
        )
      end

      it "creates invites for each recipient" do
        expect { described_class.execute(**params_with_recipients) }
          .to change(Invite, :count).by(1)
      end
    end
  end

  describe "routing" do
    it { expect(described_class.route_config).to include(method: :post, scope: :collection) }
  end

  describe "schema" do
    it { expect(described_class.schema_slug).to eq("rib_request") }
  end
end
