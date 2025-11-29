# frozen_string_literal: true

module ActivitiesService
  class ActivitySchema < Core::Schema::Base
    title "Activity"
    description "An activity log entry"

    string :activity_type, description: "Type of activity (e.g., created, updated, deleted)"
    string :category, description: "Activity category (e.g., contact, invite)"
    string :level, description: "Severity level", enum: %w[info warning error]
    string :message, description: "Human-readable activity message"
    string :item_id, description: "Related item ID", required: false
    string :schema_slug, description: "Schema slug of related item", required: false
    string :tool_slug, description: "Tool that triggered activity", required: false
    string :feature_slug, description: "Feature slug", required: false
    object :metadata, required: false do
      additional_properties true
    end

    timestamps
  end
end
