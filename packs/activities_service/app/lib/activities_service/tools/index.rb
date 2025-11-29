# frozen_string_literal: true

module ActivitiesService
  module Tools
    class Index < Core::Tools::Base
      route method: :get, scope: :collection

      def execute(limit: 50, **_)
        activities = Activity
          .where(workspace_id:)
          .order(created_at: :desc)
          .limit(limit.to_i)

        {
          activities: activities.map { |a| ActivitySerializer.new(a).to_h }
        }
      end
    end
  end
end
