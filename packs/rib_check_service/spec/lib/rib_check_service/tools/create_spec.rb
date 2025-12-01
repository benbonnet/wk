# frozen_string_literal: true

require "rails_helper"

RSpec.describe RibCheckService::Tools::Create do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }

  describe ".execute" do
    let(:params) do
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
      expect { described_class.execute(**params) }.to change(Item, :count).by(1)
    end

    it "creates an activity" do
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
          data: {
            recipients_attributes: [{ id: recipient.id }]
          }
        )
      end

      it "creates invites for each recipient" do
        expect { described_class.execute(**params_with_recipients) }
          .to change(Invite, :count).by(1)
      end

      it "returns invites_count in meta" do
        result = described_class.execute(**params_with_recipients)
        expect(result[:meta][:invites_count]).to eq(1)
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
