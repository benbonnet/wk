# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Routes API", type: :request do
  let(:user) { create(:user) }
  let!(:workspace) { user.default_workspace }

  describe "GET /api/v1/routes with session auth" do
    before { sign_in(user, scope: :user) }

    it "returns routes array" do
      get "/api/v1/routes"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to have_key("routes")
      expect(response.parsed_body["routes"]).to be_an(Array)
    end
  end

  describe "GET /api/v1/routes with JWT auth" do
    let(:auth_headers) { { "Authorization" => "Bearer #{Auth::JwtService.encode({ user_id: user.id, workspace_id: workspace.id })}" } }

    it "returns routes array" do
      get "/api/v1/routes", headers: auth_headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to have_key("routes")
      expect(response.parsed_body["routes"]).to be_an(Array)
    end
  end

  describe "GET /api/v1/routes" do
    let(:auth_headers) { { "Authorization" => "Bearer #{Auth::JwtService.encode({ user_id: user.id, workspace_id: workspace.id })}" } }
    it "returns routes array" do
      get "/api/v1/routes", headers: auth_headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to have_key("routes")
      expect(response.parsed_body["routes"]).to be_an(Array)
    end

    it "includes routable views with correct structure" do
      get "/api/v1/routes", headers: auth_headers

      routes = response.parsed_body["routes"]

      # Should have at least contacts and rib-checks from existing views
      contacts_route = routes.find { |r| r["path"] == "/contacts" }
      expect(contacts_route).to include(
        "namespace" => "workspaces",
        "feature" => "contacts",
        "view" => "index"
      )
    end

    it "excludes non-routable views" do
      get "/api/v1/routes", headers: auth_headers

      routes = response.parsed_body["routes"]
      view_names = routes.select { |r| r["feature"] == "contacts" }.map { |r| r["view"] }

      expect(view_names).to include("index", "show")
      expect(view_names).not_to include("form")
    end
  end
end
