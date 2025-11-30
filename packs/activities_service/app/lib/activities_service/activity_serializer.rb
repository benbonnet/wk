# frozen_string_literal: true

module ActivitiesService
  class ActivitySerializer
    include Alba::Resource

    attributes :id, :workspace_id, :user_id, :activity_type, :category, :level, :message
    attributes :item_id, :schema_slug, :tool_slug, :feature_slug
    attributes :error_code, :error_stack, :duration_ms, :metadata

    attribute :created_at do |activity|
      activity.created_at&.iso8601
    end
  end
end
