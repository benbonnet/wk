# frozen_string_literal: true

module ActivitiesService
  module Tools
    class Create < Core::Tools::Base
      description "Log an activity event"
      # No route - workflow only

      params ActivitySchema

      def execute(
        user_id:,
        workspace_id:,
        activity_type:,
        category:,
        level:,
        message:,
        item_id: nil,
        schema_slug: nil,
        tool_slug: nil,
        feature_slug: nil,
        metadata: {},
        **_
      )
        activity = Activity.create!(
          workspace_id:,
          user_id:,
          activity_type:,
          category:,
          level:,
          message:,
          item_id:,
          schema_slug:,
          tool_slug:,
          feature_slug:,
          metadata:
        )

        ActivitySerializer.new(activity).to_h
      end
    end
  end
end
