# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Contacts API", type: :request do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }

  before do
    Core::Schema::Registry.clear!
    Core::Features::Registry.clear!

    # Register schema
    Core::Schema::Registry.register(ContactsService::ContactSchema)

    # Register feature
    Core::Features::Registry.register(
      namespace: :workspaces,
      feature: :contacts,
      schema: :contact,
      tools: [
        ContactsService::Tools::Index,
        ContactsService::Tools::Show,
        ContactsService::Tools::Create,
        ContactsService::Tools::Update,
        ContactsService::Tools::Destroy,
        ContactsService::Tools::AddRelationship
      ]
    )

    Core::Relationships::Registry.reload!
  end

  describe "GET /api/v1/workspaces/contacts" do
    it "returns contacts list" do
      get "/api/v1/workspaces/contacts", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body).to have_key("data")
      expect(body).to have_key("meta")
    end

    it "supports pagination params" do
      get "/api/v1/workspaces/contacts", params: { page: 2, per_page: 10 }, headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["meta"]["page"]).to eq(2)
      expect(body["meta"]["per_page"]).to eq(10)
    end
  end

  describe "POST /api/v1/workspaces/contacts" do
    let(:valid_params) do
      {
        contact: {
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com"
        }
      }
    end

    it "creates a contact" do
      post "/api/v1/workspaces/contacts", params: valid_params, headers: auth_headers(user)

      expect(response).to have_http_status(:ok), -> { "Response: #{response.status} - #{response.body}" }

      body = JSON.parse(response.body)
      expect(body["data"]["data"]["first_name"]).to eq("John")
      expect(body["meta"]["created"]).to be true
    end

    it "returns validation error for missing fields" do
      post "/api/v1/workspaces/contacts", params: { contact: {} }, headers: auth_headers(user)

      expect(response).to have_http_status(:unprocessable_content)
      body = JSON.parse(response.body)
      expect(body["error"]).to eq("Validation failed")
      expect(body["details"]).to have_key("first_name")
    end
  end

  describe "GET /api/v1/workspaces/contacts/:id" do
    let(:contact) do
      create(:item,
        schema_slug: "contact",
        tool_slug: "create",
        data: { "first_name" => "Jane", "last_name" => "Smith" },
        created_by: user
      )
    end

    it "returns the contact with serialized data" do
      get "/api/v1/workspaces/contacts/#{contact.id}", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)

      # Serializer exposes data field, frontend picks from it
      expect(body["data"]["id"]).to eq(contact.id)
      expect(body["data"]["data"]["first_name"]).to eq("Jane")
      expect(body["data"]["data"]["last_name"]).to eq("Smith")
      expect(body["data"]["schema_slug"]).to eq("contact")
      expect(body["data"]["created_at"]).to be_present
    end

    it "includes relationships from schema definition" do
      spouse = create(:item,
        schema_slug: "contact",
        tool_slug: "create",
        data: { "first_name" => "John", "last_name" => "Smith" },
        created_by: user
      )

      child = create(:item,
        schema_slug: "contact",
        tool_slug: "create",
        data: { "first_name" => "Junior", "last_name" => "Smith" },
        created_by: user
      )

      # Create relationships
      ItemRelationship.create!(source_item: contact, target_item: spouse, relationship_type: "spouse")
      ItemRelationship.create!(source_item: contact, target_item: child, relationship_type: "children")

      get "/api/v1/workspaces/contacts/#{contact.id}", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)

      # Relationships loaded based on schema definition
      expect(body["data"]["relationships"]).to be_a(Hash)
      expect(body["data"]["relationships"]["spouse"]["id"]).to eq(spouse.id)
      expect(body["data"]["relationships"]["spouse"]["first_name"]).to eq("John")
      expect(body["data"]["relationships"]["children"]).to be_an(Array)
      expect(body["data"]["relationships"]["children"].first["id"]).to eq(child.id)
    end

    it "returns 404 for unknown contact" do
      get "/api/v1/workspaces/contacts/99999", headers: auth_headers(user)

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "PUT /api/v1/workspaces/contacts/:id" do
    let(:contact) do
      create(:item,
        schema_slug: "contact",
        tool_slug: "create",
        data: { "first_name" => "Jane", "last_name" => "Smith" },
        created_by: user
      )
    end

    it "updates the contact" do
      put "/api/v1/workspaces/contacts/#{contact.id}",
        params: { contact: { first_name: "Janet" } },
        headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["data"]["data"]["first_name"]).to eq("Janet")
      expect(body["meta"]["updated"]).to be true
    end
  end

  describe "DELETE /api/v1/workspaces/contacts/:id" do
    let(:contact) do
      create(:item,
        schema_slug: "contact",
        tool_slug: "create",
        data: { "first_name" => "Jane", "last_name" => "Smith" },
        created_by: user
      )
    end

    it "soft deletes the contact" do
      delete "/api/v1/workspaces/contacts/#{contact.id}", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["meta"]["deleted"]).to be true

      contact.reload
      expect(contact.deleted_at).not_to be_nil
    end
  end

  describe "POST /api/v1/workspaces/contacts/:id/relationships" do
    let(:parent) do
      create(:item,
        schema_slug: "contact",
        tool_slug: "create",
        data: { "first_name" => "Parent", "last_name" => "Contact" },
        created_by: user
      )
    end

    let(:child) do
      create(:item,
        schema_slug: "contact",
        tool_slug: "create",
        data: { "first_name" => "Child", "last_name" => "Contact" },
        created_by: user
      )
    end

    it "adds a relationship" do
      expect {
        post "/api/v1/workspaces/contacts/#{parent.id}/relationships",
          params: { relationship_type: "children", target_id: child.id },
          headers: auth_headers(user)
      }.to change(ItemRelationship, :count).by(2) # forward + inverse

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["data"]["relationship_type"]).to eq("children")
    end
  end

  describe "unknown feature" do
    it "returns 404" do
      get "/api/v1/workspaces/unknown_feature", headers: auth_headers(user)
      expect(response).to have_http_status(:not_found)
    end
  end

  private

    def auth_headers(user)
      payload = { user_id: user.id, workspace_id: workspace.id }
      token = Auth::JwtService.encode(payload)
      { "Authorization" => "Bearer #{token}" }
    end
end
