# frozen_string_literal: true

module RibCheckWorkflow
  module Tools
    class Show < Core::Tools::Base
      description "Show a RIB request"
      route method: :get, scope: :member
      schema "rib_request"

      def execute(user_id:, workspace_id:, id:, **_)
        item = find_item!(id)

        { data: Core::Serializers::ItemSerializer.new(item).to_h }
      end
    end
  end
end
