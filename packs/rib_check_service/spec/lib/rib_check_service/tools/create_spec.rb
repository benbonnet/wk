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
      let(:contact_item) do
        create(:item,
          schema_slug: "contact",
          workspace:,
          created_by: user,
          data: { "first_name" => "John", "last_name" => "Doe" }
        )
      end

      let(:email_item) do
        create(:item,
          schema_slug: "email",
          workspace:,
          created_by: user,
          data: { "address" => "john@example.com", "is_primary" => true }
        )
      end

      before do
        # Create relationship between contact and email
        ItemRelationship.create!(
          source_item: contact_item,
          target_item: email_item,
          relationship_type: "emails"
        )
      end

      let(:params_with_recipients) do
        params.deep_merge(
          data: {
            recipients_attributes: [{ id: contact_item.id }]
          }
        )
      end

      it "creates invites for each recipient" do
        expect { described_class.execute(**params_with_recipients) }
          .to change(Invite, :count).by(1)
      end

      it "does not create users upfront" do
        expect { described_class.execute(**params_with_recipients) }
          .not_to change(User, :count)
      end

      it "extracts invitee_email from contact's email relationship" do
        described_class.execute(**params_with_recipients)

        invite = Invite.last
        expect(invite.invitee_email).to eq("john@example.com")
        expect(invite.invitee_id).to be_nil
      end

      it "links invite to source contact item via polymorphic" do
        described_class.execute(**params_with_recipients)

        invite = Invite.last
        expect(invite.source_type).to eq("Item")
        expect(invite.source_id).to eq(contact_item.id)
        expect(invite.source).to eq(contact_item)
      end

      it "links invite to rib_request item via invite_items" do
        described_class.execute(**params_with_recipients)

        invite = Invite.last
        rib_request = Item.find_by(schema_slug: "rib_request")
        expect(invite.item_ids).to include(rib_request.id)
      end

      it "returns invites_count in meta" do
        result = described_class.execute(**params_with_recipients)
        expect(result[:meta][:invites_count]).to eq(1)
      end

      context "when contact has no email relationship" do
        let(:contact_without_email) do
          create(:item,
            schema_slug: "contact",
            workspace:,
            created_by: user,
            data: { "first_name" => "Jane", "last_name" => "Doe" }
          )
        end

        let(:params_no_email) do
          params.deep_merge(
            data: {
              recipients_attributes: [{ id: contact_without_email.id }]
            }
          )
        end

        it "raises validation error" do
          expect { described_class.execute(**params_no_email) }
            .to raise_error(Core::Tools::ValidationError, /Contact has no email/)
        end
      end

      context "with multiple recipients" do
        let(:contact_item_2) do
          create(:item,
            schema_slug: "contact",
            workspace:,
            created_by: user,
            data: { "first_name" => "Jane", "last_name" => "Smith" }
          )
        end

        let(:email_item_2) do
          create(:item,
            schema_slug: "email",
            workspace:,
            created_by: user,
            data: { "address" => "jane@example.com", "is_primary" => true }
          )
        end

        before do
          ItemRelationship.create!(
            source_item: contact_item_2,
            target_item: email_item_2,
            relationship_type: "emails"
          )
        end

        let(:params_with_multiple_recipients) do
          params.deep_merge(
            data: {
              recipients_attributes: [
                { id: contact_item.id },
                { id: contact_item_2.id }
              ]
            }
          )
        end

        it "creates invites for all recipients" do
          expect { described_class.execute(**params_with_multiple_recipients) }
            .to change(Invite, :count).by(2)
        end

        it "does not create users" do
          expect { described_class.execute(**params_with_multiple_recipients) }
            .not_to change(User, :count)
        end
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
