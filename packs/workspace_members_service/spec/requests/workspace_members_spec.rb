# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Workspace Members API", type: :request do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let!(:workspace_user) { create(:workspace_user, workspace:, user:, role: "admin") }
  let(:Authorization) { "Bearer #{Auth::JwtService.encode({ user_id: user.id, workspace_id: workspace.id })}" }

  path "/workspaces/workspace_members" do
    get "List workspace members" do
      tags "Workspace Members"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :page, in: :query, type: :integer, required: false
      parameter name: :search, in: :query, type: :string, required: false

      response "200", "members listed" do
        run_test! do |response|
          json = JSON.parse(response.body)
          expect(json["data"]).to be_an(Array)
          expect(json["meta"]).to include("total", "page")
        end
      end
    end

    post "Add workspace member" do
      tags "Workspace Members"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          data: {
            type: :object,
            properties: {
              email: { type: :string },
              role: { type: :string }
            }
          }
        },
        required: ["data"]
      }

      response "200", "member added" do
        let(:other_user) { create(:user, email: "other@example.com") }
        let(:body) { { data: { email: other_user.email, role: "editor" } } }

        run_test! do |response|
          json = JSON.parse(response.body)
          expect(json["data"]["email"]).to eq("other@example.com")
          expect(json["meta"]["created"]).to be true
        end
      end

      response "422", "user already member" do
        let(:body) { { data: { email: user.email, role: "editor" } } }

        run_test! do |response|
          json = JSON.parse(response.body)
          expect(json["error"]).to include("already a member")
        end
      end
    end
  end

  path "/workspaces/workspace_members/{id}" do
    let(:other_user) { create(:user) }
    let!(:other_member) { create(:workspace_user, workspace:, user: other_user, role: "editor") }
    let(:id) { other_member.id }

    put "Update member role" do
      tags "Workspace Members"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :id, in: :path, type: :integer
      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          data: {
            type: :object,
            properties: { role: { type: :string } }
          }
        },
        required: ["data"]
      }

      response "200", "member updated" do
        let(:body) { { data: { role: "manager" } } }

        run_test! do |response|
          json = JSON.parse(response.body)
          expect(json["data"]["role"]).to eq("manager")
        end
      end
    end

    delete "Remove member" do
      tags "Workspace Members"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :id, in: :path, type: :integer

      response "200", "member removed" do
        run_test! do |response|
          json = JSON.parse(response.body)
          expect(json["meta"]["deleted"]).to be true
        end
      end
    end
  end

  path "/workspaces/workspace_members/{id}/block" do
    let(:other_user) { create(:user) }
    let!(:other_member) { create(:workspace_user, workspace:, user: other_user, role: "editor") }
    let(:id) { other_member.id }

    post "Block member" do
      tags "Workspace Members"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :id, in: :path, type: :integer
      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          data: {
            type: :object,
            properties: { blocked: { type: :boolean } }
          }
        },
        required: ["data"]
      }

      response "200", "member blocked" do
        let(:body) { { data: { blocked: true } } }

        run_test! do |response|
          json = JSON.parse(response.body)
          expect(json["data"]["status"]).to eq("blocked")
        end
      end
    end
  end
end
