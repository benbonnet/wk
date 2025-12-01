# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Contacts query count", type: :request do
  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }
  let(:auth_header) { { "Authorization" => "Bearer #{Auth::JwtService.encode({ user_id: user.id, workspace_id: workspace.id })}" } }

  def count_queries(&block)
    queries = []
    callback = ->(*, payload) do
      sql = payload[:sql]
      # Skip schema/transaction queries
      queries << sql unless sql.include?("SCHEMA") || sql.start_with?("BEGIN") || sql.start_with?("COMMIT")
    end
    ActiveSupport::Notifications.subscribed(callback, "sql.active_record", &block)
    queries
  end

  describe "GET /workspaces/contacts (index)" do
    before do
      10.times do |i|
        contact = create(:item,
          workspace:,
          schema_slug: "contact",
          tool_slug: "create",
          data: { "first_name" => "Contact#{i}", "last_name" => "Test" },
          created_by: user
        )

        # Add relationships
        email = create(:item,
          workspace:, schema_slug: "email", tool_slug: "nested_create",
          data: { "address" => "c#{i}@example.com", "is_primary" => true },
          created_by: user
        )
        ItemRelationship.create!(source_item: contact, target_item: email, relationship_type: "emails")

        phone = create(:item,
          workspace:, schema_slug: "phone", tool_slug: "nested_create",
          data: { "number" => "+1555#{i}", "is_primary" => true },
          created_by: user
        )
        ItemRelationship.create!(source_item: contact, target_item: phone, relationship_type: "phones")
      end
    end

    it "loads 10 contacts with relationships in constant queries" do
      queries = count_queries do
        get "/api/v1/workspaces/contacts", headers: auth_header
      end

      # Expected: ~7 queries (search_path, user, workspace, count, items, relationships, target_items)
      # Not: 10 * relationships_per_contact queries (would be 50+)
      expect(queries.size).to be <= 8, "Expected <= 8 queries, got #{queries.size}:\n#{queries.join("\n")}"
    end
  end

  describe "GET /workspaces/contacts/:id (show)" do
    let(:contact) do
      create(:item,
        workspace:,
        schema_slug: "contact",
        tool_slug: "create",
        data: { "first_name" => "Jane", "last_name" => "Smith" },
        created_by: user
      )
    end

    before do
      3.times do |i|
        email = create(:item,
          workspace:, schema_slug: "email", tool_slug: "nested_create",
          data: { "address" => "email#{i}@example.com", "is_primary" => i == 0 },
          created_by: user
        )
        ItemRelationship.create!(source_item: contact, target_item: email, relationship_type: "emails")
      end

      spouse = create(:item,
        workspace:, schema_slug: "contact", tool_slug: "create",
        data: { "first_name" => "John", "last_name" => "Smith" },
        created_by: user
      )
      ItemRelationship.create!(source_item: contact, target_item: spouse, relationship_type: "spouse")
    end

    it "loads contact with relationships in constant queries" do
      queries = count_queries do
        get "/api/v1/workspaces/contacts/#{contact.id}", headers: auth_header
      end

      # Expected: ~3 queries (item, relationships, target_items)
      expect(queries.size).to be <= 5, "Expected <= 5 queries, got #{queries.size}:\n#{queries.join("\n")}"
    end

    it "returns computed attributes from relationships" do
      get "/api/v1/workspaces/contacts/#{contact.id}", headers: auth_header

      body = response.parsed_body
      expect(body["data"]["primary_email"]).to eq("email0@example.com")
      expect(body["data"]["spouse_full_name"]).to eq("John Smith")
    end
  end
end
