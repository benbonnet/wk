# frozen_string_literal: true

module ItemsService
  class ItemSchema < Core::Schema::Base
    title "Item"
    description "Generic item wrapper for all domain data"

    integer :id, description: "Unique identifier"
    object :data, description: "Domain-specific data" do
      additional_properties true
    end
    integer :workspace_id, description: "Workspace ID"
    integer :created_by_id, description: "Creator user ID"
    integer :updated_by_id, required: false, description: "Last updater user ID"
    string :schema_slug, description: "Schema type identifier"
    string :tool_slug, description: "Tool that created/modified this item"
    string :created_at, format: "date-time", description: "Creation timestamp"
    string :updated_at, format: "date-time", description: "Last update timestamp"
    string :deleted_at, format: "date-time", required: false, description: "Soft delete timestamp"
    object :relationships, required: false, description: "Related items" do
      additional_properties true
    end
  end
end
