# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Contacts API", type: :request do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:Authorization) { "Bearer #{Auth::JwtService.encode({ user_id: user.id, workspace_id: workspace.id })}" }


  path "/workspaces/contacts" do
    get "List contacts" do
      tags "Contacts"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :page, in: :query, type: :integer, required: false
      parameter name: :per_page, in: :query, type: :integer, required: false
      parameter name: :search, in: :query, type: :string, required: false

      response "200", "contacts list" do
        schema type: :object,
          properties: {
            data: { type: :array, items: { "$ref" => "#/components/schemas/item" } },
            meta: {
              type: :object,
              properties: {
                page: { type: :integer },
                per_page: { type: :integer },
                total: { type: :integer },
                total_pages: { type: :integer }
              }
            }
          }

        let!(:contacts) do
          3.times.map do |i|
            create(:item,
              workspace:,
              schema_slug: "contact",
              tool_slug: "create",
              data: { "first_name" => "Contact#{i}", "last_name" => "Test" },
              created_by: user
            )
          end
        end

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["data"].size).to eq(3)
          expect(body["meta"]["total"]).to eq(3)
        end
      end

      response "200", "paginated results" do
        let(:page) { 2 }
        let(:per_page) { 10 }

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["meta"]["page"]).to eq(2)
          expect(body["meta"]["per_page"]).to eq(10)
        end
      end
    end

    post "Create contact" do
      tags "Contacts"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          data: {
            type: :object,
            properties: {
              first_name: { type: :string },
              last_name: { type: :string },
              email: { type: :string }
            },
            required: %w[first_name last_name]
          }
        }
      }

      response "200", "contact created" do
        schema type: :object,
          properties: {
            data: { "$ref" => "#/components/schemas/item" },
            meta: { type: :object, properties: { created: { type: :boolean } } }
          }

        let(:body) { { data: { first_name: "John", last_name: "Doe", email: "john@example.com" } } }

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["data"]["data"]["first_name"]).to eq("John")
          expect(body["meta"]["created"]).to be true
        end
      end

      response "422", "validation error" do
        schema type: :object,
          properties: {
            error: { type: :string },
            details: { type: :object }
          }

        # Send data with email but missing required first_name and last_name
        let(:body) { { data: { email: "test@example.com" } } }

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["error"]).to eq("Validation failed")
          expect(body["details"]).to have_key("data")
        end
      end
    end
  end

  path "/workspaces/contacts/{id}" do
    parameter name: :id, in: :path, type: :integer, required: true

    get "Get contact" do
      tags "Contacts"
      produces "application/json"
      security [{ bearerAuth: [] }]

      response "200", "contact found" do
        schema type: :object,
          properties: {
            data: { "$ref" => "#/components/schemas/item" }
          }

        let(:contact) do
          create(:item,
            workspace:,
            schema_slug: "contact",
            tool_slug: "create",
            data: { "first_name" => "Jane", "last_name" => "Smith" },
            created_by: user
          )
        end
        let(:id) { contact.id }

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["data"]["id"]).to eq(contact.id)
          expect(body["data"]["data"]["first_name"]).to eq("Jane")
        end
      end

      response "404", "contact not found" do
        let(:id) { 99999 }

        run_test!
      end
    end

    put "Update contact" do
      tags "Contacts"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          data: { type: :object }
        }
      }

      response "200", "contact updated" do
        schema type: :object,
          properties: {
            data: { "$ref" => "#/components/schemas/item" },
            meta: { type: :object, properties: { updated: { type: :boolean } } }
          }

        let(:contact) do
          create(:item,
            workspace:,
            schema_slug: "contact",
            tool_slug: "create",
            data: { "first_name" => "Jane", "last_name" => "Smith" },
            created_by: user
          )
        end
        let(:id) { contact.id }
        let(:body) { { data: { first_name: "Janet" } } }

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["data"]["data"]["first_name"]).to eq("Janet")
          expect(body["meta"]["updated"]).to be true
        end
      end

      response "404", "contact not found" do
        let(:id) { 99999 }
        let(:body) { { data: { first_name: "Janet" } } }

        run_test!
      end
    end

    delete "Delete contact" do
      tags "Contacts"
      produces "application/json"
      security [{ bearerAuth: [] }]

      response "200", "contact deleted" do
        schema type: :object,
          properties: {
            meta: {
              type: :object,
              properties: {
                deleted: { type: :boolean },
                id: { type: :string }
              }
            }
          }

        let(:contact) do
          create(:item,
            workspace:,
            schema_slug: "contact",
            tool_slug: "create",
            data: { "first_name" => "Jane", "last_name" => "Smith" },
            created_by: user
          )
        end
        let(:id) { contact.id }

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["meta"]["deleted"]).to be true
          expect(contact.reload.deleted_at).not_to be_nil
        end
      end

      response "404", "contact not found" do
        let(:id) { 99999 }

        run_test!
      end
    end
  end

  path "/workspaces/contacts/{id}/relationships" do
    parameter name: :id, in: :path, type: :integer, required: true

    post "Add relationship" do
      tags "Contacts"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          relationship_type: { type: :string },
          target_id: { type: :integer }
        },
        required: %w[relationship_type target_id]
      }

      response "200", "relationship added" do
        schema type: :object,
          properties: {
            data: {
              type: :object,
              properties: {
                id: { type: :integer },
                relationship_type: { type: :string },
                source_id: { type: :integer },
                target_id: { type: :integer }
              }
            },
            meta: { type: :object, properties: { created: { type: :boolean } } }
          }

        let(:parent) do
          create(:item,
            workspace:,
            schema_slug: "contact",
            tool_slug: "create",
            data: { "first_name" => "Parent", "last_name" => "Contact" },
            created_by: user
          )
        end
        let(:child) do
          create(:item,
            workspace:,
            schema_slug: "contact",
            tool_slug: "create",
            data: { "first_name" => "Child", "last_name" => "Contact" },
            created_by: user
          )
        end
        let(:id) { parent.id }
        let(:body) { { relationship_type: "children", target_id: child.id } }

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["data"]["relationship_type"]).to eq("children")
        end
      end

      response "404", "contact not found" do
        let(:id) { 99999 }
        let(:body) { { relationship_type: "children", target_id: 1 } }

        run_test!
      end
    end
  end
end
