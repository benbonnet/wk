# frozen_string_literal: true

require "rails_helper"

RSpec.describe "RIB Requests API", type: :request do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }

  before do
    Core::Schema::Registry.clear!
    Core::Features::Registry.clear!
    Core::Workflow::Registry.clear!

    # Register schema
    Core::Schema::Registry.register(RibCheckWorkflow::RibRequestSchema)

    # Register feature
    Core::Features::Registry.register(
      namespace: :workspaces,
      feature: :rib_requests,
      schema: :rib_request,
      tools: [
        RibCheckWorkflow::Tools::Index,
        RibCheckWorkflow::Tools::Show,
        RibCheckWorkflow::Tools::Create,
        RibCheckWorkflow::Tools::Update,
        RibCheckWorkflow::Tools::Destroy,
        RibCheckWorkflow::Tools::Cancel
      ]
    )

    # Register workflows
    workflow_dir = Rails.root.join("packs/rib_check_workflow/app/lib/rib_check_workflow/workflows")
    Dir["#{workflow_dir}/*.yml"].each do |path|
      Core::Workflow::Registry.register(path)
    end
  end

  describe "GET /api/v1/workspaces/rib_requests" do
    it "returns rib_requests list" do
      get "/api/v1/workspaces/rib_requests", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body).to have_key("data")
      expect(body).to have_key("meta")
    end

    it "supports pagination params" do
      get "/api/v1/workspaces/rib_requests", params: { page: 2, per_page: 10 }, headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["meta"]["page"]).to eq(2)
      expect(body["meta"]["per_page"]).to eq(10)
    end
  end

  describe "POST /api/v1/workspaces/rib_requests" do
    let(:valid_params) do
      {
        rib_request: {
          message_body: "Please provide your RIB",
          request_type: "individual",
          status: "draft"
        }
      }
    end

    it "creates a rib_request via workflow" do
      expect {
        post "/api/v1/workspaces/rib_requests", params: valid_params, headers: auth_headers(user)
      }.to change(Item, :count).by(1)
        .and change(Activity, :count).by(1)
        .and change(WorkflowExecution, :count).by(1)

      expect(response).to have_http_status(:ok), -> { "Response: #{response.status} - #{response.body}" }

      body = JSON.parse(response.body)
      expect(body["data"]["data"]["message_body"]).to eq("Please provide your RIB")
      expect(body["meta"]["created"]).to be true
    end

    it "creates invites when recipients provided" do
      recipient = create(:user)
      params = {
        rib_request: {
          message_body: "Please provide your RIB",
          request_type: "individual",
          status: "pending",
          recipients_attributes: [{ id: recipient.id }]
        }
      }

      expect {
        post "/api/v1/workspaces/rib_requests", params:, headers: auth_headers(user)
      }.to change(Invite, :count).by(1)

      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /api/v1/workspaces/rib_requests/:id" do
    let(:rib_request) do
      create(:item,
        schema_slug: "rib_request",
        tool_slug: "create",
        workspace:,
        data: { "status" => "draft", "message_body" => "Test RIB request" },
        created_by: user
      )
    end

    it "returns the rib_request with serialized data" do
      get "/api/v1/workspaces/rib_requests/#{rib_request.id}", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)

      expect(body["data"]["id"]).to eq(rib_request.id)
      expect(body["data"]["data"]["status"]).to eq("draft")
      expect(body["data"]["data"]["message_body"]).to eq("Test RIB request")
      expect(body["data"]["schema_slug"]).to eq("rib_request")
    end

    it "returns 404 for unknown rib_request" do
      get "/api/v1/workspaces/rib_requests/99999", headers: auth_headers(user)

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "PUT /api/v1/workspaces/rib_requests/:id" do
    let(:rib_request) do
      create(:item,
        schema_slug: "rib_request",
        tool_slug: "create",
        workspace:,
        data: { "status" => "draft", "message_body" => "Original" },
        created_by: user
      )
    end

    it "updates the rib_request via workflow" do
      expect {
        put "/api/v1/workspaces/rib_requests/#{rib_request.id}",
          params: { rib_request: { status: "pending", message_body: "Updated" } },
          headers: auth_headers(user)
      }.to change(Activity, :count).by(1)
        .and change(WorkflowExecution, :count).by(1)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["data"]["data"]["status"]).to eq("pending")
      expect(body["data"]["data"]["message_body"]).to eq("Updated")
      expect(body["meta"]["updated"]).to be true
    end
  end

  describe "POST /api/v1/workspaces/rib_requests/:id/cancel" do
    let(:rib_request) do
      create(:item,
        schema_slug: "rib_request",
        tool_slug: "create",
        workspace:,
        data: { "status" => "pending" },
        created_by: user
      )
    end

    it "cancels the rib_request via workflow" do
      expect {
        post "/api/v1/workspaces/rib_requests/#{rib_request.id}/cancel",
          headers: auth_headers(user)
      }.to change(Activity, :count).by(1)
        .and change(WorkflowExecution, :count).by(1)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["data"]["data"]["status"]).to eq("cancelled")
      expect(body["meta"]["cancelled"]).to be true
    end

    it "returns error when cancelling completed request" do
      completed_request = create(:item,
        schema_slug: "rib_request",
        tool_slug: "create",
        workspace:,
        data: { "status" => "completed" },
        created_by: user
      )

      post "/api/v1/workspaces/rib_requests/#{completed_request.id}/cancel",
        headers: auth_headers(user)

      expect(response).to have_http_status(:unprocessable_content)
      body = JSON.parse(response.body)
      expect(body["error"]).to eq("Cannot cancel completed request")
    end
  end

  describe "DELETE /api/v1/workspaces/rib_requests/:id" do
    let(:rib_request) do
      create(:item,
        schema_slug: "rib_request",
        tool_slug: "create",
        workspace:,
        data: { "status" => "draft" },
        created_by: user
      )
    end

    it "soft deletes the rib_request" do
      delete "/api/v1/workspaces/rib_requests/#{rib_request.id}", headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["meta"]["deleted"]).to be true

      rib_request.reload
      expect(rib_request.deleted_at).not_to be_nil
    end
  end

  private

    def auth_headers(user)
      payload = { user_id: user.id, workspace_id: workspace.id }
      token = Auth::JwtService.encode(payload)
      { "Authorization" => "Bearer #{token}" }
    end
end
