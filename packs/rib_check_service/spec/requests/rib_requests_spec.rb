# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "RIB Requests API", type: :request do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:Authorization) { "Bearer #{Auth::JwtService.encode({ user_id: user.id, workspace_id: workspace.id })}" }


  path "/workspaces/rib_checks" do
    get "List RIB requests" do
      tags "RIB Requests"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :page, in: :query, type: :integer, required: false
      parameter name: :per_page, in: :query, type: :integer, required: false

      response "200", "rib requests list" do
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

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body).to have_key("data")
          expect(body).to have_key("meta")
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

    post "Create RIB request" do
      tags "RIB Requests"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          message_body: { type: :string },
          request_type: { type: :string },
          status: { type: :string }
        }
      }

      response "200", "rib request created" do
        schema type: :object,
          properties: {
            data: { "$ref" => "#/components/schemas/item" },
            meta: { type: :object, properties: { created: { type: :boolean } } }
          }

        # Flat params - controller wraps into data
        let(:body) do
          {
            message_body: "Please provide your RIB",
            request_type: "individual",
            status: "draft"
          }
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          # Response is now flat
          expect(data["data"]["message_body"]).to eq("Please provide your RIB")
          expect(data["meta"]["created"]).to be true
        end
      end
    end
  end

  path "/workspaces/rib_checks/{id}" do
    parameter name: :id, in: :path, type: :integer, required: true

    get "Get RIB request" do
      tags "RIB Requests"
      produces "application/json"
      security [{ bearerAuth: [] }]

      response "200", "rib request found" do
        schema type: :object,
          properties: {
            data: { "$ref" => "#/components/schemas/item" }
          }

        let(:rib_request) do
          create(:item,
            schema_slug: "rib_request",
            tool_slug: "create",
            workspace:,
            data: { "request_type" => "individual", "status" => "draft", "message_body" => "Test RIB request" },
            created_by: user
          )
        end
        let(:id) { rib_request.id }

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["data"]["id"]).to eq(rib_request.id)
          # Response is now flat
          expect(body["data"]["status"]).to eq("draft")
        end
      end

      response "404", "rib request not found" do
        let(:id) { 99999 }

        run_test!
      end
    end

    put "Update RIB request" do
      tags "RIB Requests"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]
      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          status: { type: :string },
          message_body: { type: :string }
        }
      }

      response "200", "rib request updated" do
        schema type: :object,
          properties: {
            data: { "$ref" => "#/components/schemas/item" },
            meta: { type: :object, properties: { updated: { type: :boolean } } }
          }

        let(:rib_request) do
          create(:item,
            schema_slug: "rib_request",
            tool_slug: "create",
            workspace:,
            data: { "request_type" => "individual", "status" => "draft", "message_body" => "Original" },
            created_by: user
          )
        end
        let(:id) { rib_request.id }
        # Flat params - controller wraps into data
        let(:body) { { status: "pending", message_body: "Updated" } }

        run_test! do |response|
          data = JSON.parse(response.body)
          # Response is now flat
          expect(data["data"]["status"]).to eq("pending")
          expect(data["data"]["message_body"]).to eq("Updated")
          expect(data["meta"]["updated"]).to be true
        end
      end

      response "404", "rib request not found" do
        let(:id) { 99999 }
        let(:body) { { status: "pending" } }

        run_test!
      end
    end

    delete "Delete RIB request" do
      tags "RIB Requests"
      produces "application/json"
      security [{ bearerAuth: [] }]

      response "200", "rib request deleted" do
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

        let(:rib_request) do
          create(:item,
            schema_slug: "rib_request",
            tool_slug: "create",
            workspace:,
            data: { "request_type" => "individual", "status" => "draft" },
            created_by: user
          )
        end
        let(:id) { rib_request.id }

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["meta"]["deleted"]).to be true
          expect(rib_request.reload.deleted_at).not_to be_nil
        end
      end

      response "404", "rib request not found" do
        let(:id) { 99999 }

        run_test!
      end
    end
  end

  path "/workspaces/rib_checks/{id}" do
    describe "serializer includes relationships as *_attributes" do
      let(:rib_request) do
        create(:item,
          schema_slug: "rib_request",
          tool_slug: "create",
          workspace:,
          data: { "request_type" => "individual", "status" => "draft", "message_body" => "Test" },
          created_by: user
        )
      end
      let(:recipient1) do
        create(:item,
          workspace:,
          schema_slug: "contact",
          tool_slug: "create",
          data: { "first_name" => "John", "last_name" => "Doe", "company" => "Acme" },
          created_by: user
        )
      end
      let(:recipient2) do
        create(:item,
          workspace:,
          schema_slug: "contact",
          tool_slug: "create",
          data: { "first_name" => "Jane", "last_name" => "Smith", "company" => "Corp" },
          created_by: user
        )
      end

      before do
        # Create relationships
        ItemRelationship.create!(source_item: rib_request, target_item: recipient1, relationship_type: "recipients")
        ItemRelationship.create!(source_item: rib_request, target_item: recipient2, relationship_type: "recipients")
      end

      it "returns recipients_attributes in data" do
        auth = "Bearer #{Auth::JwtService.encode({ user_id: user.id, workspace_id: workspace.id })}"
        get "/api/v1/workspaces/rib_checks/#{rib_request.id}", headers: { "Authorization" => auth }

        expect(response).to have_http_status(:ok)
        body = response.parsed_body

        # Response is now flat - recipients_attributes at top level
        expect(body["data"]).to have_key("recipients_attributes")
        recipients = body["data"]["recipients_attributes"]
        expect(recipients.size).to eq(2)
        expect(recipients.map { |r| r["first_name"] }).to contain_exactly("John", "Jane")
      end

      it "returns documents_attributes (empty) in data" do
        auth = "Bearer #{Auth::JwtService.encode({ user_id: user.id, workspace_id: workspace.id })}"
        get "/api/v1/workspaces/rib_checks/#{rib_request.id}", headers: { "Authorization" => auth }

        expect(response).to have_http_status(:ok)
        body = response.parsed_body

        # Response is now flat - documents_attributes at top level
        expect(body["data"]).to have_key("documents_attributes")
        expect(body["data"]["documents_attributes"]).to eq([])
      end
    end
  end

  path "/workspaces/rib_checks/{id}/cancel" do
    parameter name: :id, in: :path, type: :integer, required: true

    post "Cancel RIB request" do
      tags "RIB Requests"
      produces "application/json"
      security [{ bearerAuth: [] }]

      response "200", "rib request cancelled" do
        schema type: :object,
          properties: {
            data: { "$ref" => "#/components/schemas/item" },
            meta: { type: :object, properties: { cancelled: { type: :boolean } } }
          }

        let(:rib_request) do
          create(:item,
            schema_slug: "rib_request",
            tool_slug: "create",
            workspace:,
            data: { "request_type" => "individual", "status" => "pending" },
            created_by: user
          )
        end
        let(:id) { rib_request.id }

        run_test! do |response|
          body = JSON.parse(response.body)
          # Response is now flat
          expect(body["data"]["status"]).to eq("cancelled")
          expect(body["meta"]["cancelled"]).to be true
        end
      end

      response "422", "cannot cancel completed request" do
        schema type: :object,
          properties: {
            error: { type: :string },
            details: { type: :object }
          }

        let(:completed_request) do
          create(:item,
            schema_slug: "rib_request",
            tool_slug: "create",
            workspace:,
            data: { "request_type" => "individual", "status" => "completed" },
            created_by: user
          )
        end
        let(:id) { completed_request.id }

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["error"]).to eq("Cannot cancel completed request")
        end
      end

      response "404", "rib request not found" do
        let(:id) { 99999 }

        run_test!
      end
    end
  end
end
