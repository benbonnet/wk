# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Authentication", type: :request do
  before do
    OmniAuth.config.test_mode = true
  end

  after do
    OmniAuth.config.test_mode = false
    OmniAuth.config.mock_auth[:auth0] = nil
  end

  describe "GET /authenticate" do
    it "returns form with Auth0 OAuth redirect" do
      get "/authenticate"

      expect(response).to have_http_status(:ok)
      expect(response.body).to include("/users/auth/auth0")
    end

    it "includes authenticity token in redirect form" do
      get "/authenticate"

      expect(response.body).to include("authenticity_token")
    end
  end

  describe "GET /users/auth/auth0/callback" do
    let(:auth0_uid) { "auth0|#{SecureRandom.hex(8)}" }
    let(:omniauth_hash) do
      OmniAuth::AuthHash.new(
        provider: "auth0",
        uid: auth0_uid,
        info: {
          email: "test@example.com",
          name: "Test User",
          nickname: "testuser",
          image: "https://example.com/avatar.png"
        }
      )
    end

    before do
      OmniAuth.config.mock_auth[:auth0] = omniauth_hash
    end

    context "when user does not exist" do
      it "creates a new user" do
        expect {
          get "/users/auth/auth0/callback"
        }.to change(User, :count).by(1)
      end

      it "sets user attributes from Auth0" do
        get "/users/auth/auth0/callback"

        user = User.last
        expect(user.auth0_id).to eq(auth0_uid)
        expect(user.email).to eq("test@example.com")
        expect(user.name).to eq("Test User")
        expect(user.login).to eq("testuser")
        expect(user.avatar_url).to eq("https://example.com/avatar.png")
      end

      it "creates a default workspace for the user" do
        expect {
          get "/users/auth/auth0/callback"
        }.to change(Workspace, :count).by(1)

        user = User.last
        expect(user.workspaces.count).to eq(1)
        expect(user.workspaces.first.name).to eq("#{user.login}'s Workspace")
      end

      it "sets workspace_id in session" do
        get "/users/auth/auth0/callback"

        user = User.last
        expect(session[:workspace_id]).to eq(user.default_workspace.id)
      end

      it "signs in the user" do
        get "/users/auth/auth0/callback"
        follow_redirect!

        expect(controller.current_user).to eq(User.last)
      end

      it "redirects to spa root" do
        get "/users/auth/auth0/callback"

        expect(response).to redirect_to(spa_root_path)
      end
    end

    context "when user already exists" do
      let!(:existing_user) { create(:user, auth0_id: auth0_uid, login: "oldlogin") }

      it "does not create new user" do
        expect {
          get "/users/auth/auth0/callback"
        }.not_to change(User, :count)
      end

      it "updates user attributes from Auth0" do
        get "/users/auth/auth0/callback"

        existing_user.reload
        expect(existing_user.email).to eq("test@example.com")
        expect(existing_user.name).to eq("Test User")
        # login should NOT change for existing user
        expect(existing_user.login).to eq("oldlogin")
      end

      it "updates last_login_at" do
        freeze_time do
          get "/users/auth/auth0/callback"

          existing_user.reload
          expect(existing_user.last_login_at).to eq(Time.current)
        end
      end

      it "uses existing workspace if present" do
        workspace = create(:workspace)
        existing_user.workspace_users.create!(workspace: workspace, role: "admin")

        expect {
          get "/users/auth/auth0/callback"
        }.not_to change(Workspace, :count)

        expect(session[:workspace_id]).to eq(workspace.id)
      end

      it "creates default workspace if user has none" do
        expect(existing_user.workspaces).to be_empty

        expect {
          get "/users/auth/auth0/callback"
        }.to change(Workspace, :count).by(1)

        expect(session[:workspace_id]).to eq(existing_user.reload.workspaces.first.id)
      end
    end
  end

  describe "OAuth failure" do
    before do
      OmniAuth.config.mock_auth[:auth0] = :invalid_credentials
    end

    it "redirects to root" do
      get "/users/auth/auth0/callback"

      expect(response).to redirect_to(root_path)
    end
  end

  describe "GET /logout" do
    let(:user) { create(:user) }
    let!(:workspace) { user.default_workspace }

    before do
      sign_in(user)
    end

    it "clears user session" do
      get "/api/v1/account"
      expect(response).to have_http_status(:ok)

      get "/logout"
      expect(response).to redirect_to(root_path)

      # Session should be cleared - next request redirects to login
      get "/api/v1/account"
      expect(response).not_to have_http_status(:ok)
    end
  end

  describe "full auth flow" do
    let(:auth0_uid) { "auth0|fullflow123" }

    before do
      OmniAuth.config.mock_auth[:auth0] = OmniAuth::AuthHash.new(
        provider: "auth0",
        uid: auth0_uid,
        info: {
          email: "fullflow@example.com",
          name: "Full Flow User",
          nickname: "fullflow"
        }
      )
    end

    it "authenticates, creates user/workspace, sets session, accesses protected route" do
      # 1. Callback creates user and workspace
      expect {
        get "/users/auth/auth0/callback"
      }.to change(User, :count).by(1)
        .and change(Workspace, :count).by(1)

      expect(response).to redirect_to(spa_root_path)

      user = User.find_by(auth0_id: auth0_uid)
      workspace = user.workspaces.first

      # 2. Session has workspace_id
      expect(session[:workspace_id]).to eq(workspace.id)

      # 3. Can access protected API
      get "/api/v1/account"
      expect(response).to have_http_status(:ok)

      json = response.parsed_body
      expect(json["user"]["id"]).to eq(user.id)
      expect(json["user"]["login"]).to eq("fullflow")

      # 4. Logout clears everything
      get "/logout"
      expect(response).to redirect_to(root_path)

      # 5. Can no longer access protected route
      get "/api/v1/account"
      expect(response).not_to have_http_status(:ok)
    end
  end
end
