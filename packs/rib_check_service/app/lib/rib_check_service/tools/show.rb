# frozen_string_literal: true

module RibCheckService
  module Tools
    class Show < Core::Tools::Base
      description "Show a RIB request"
      route method: :get, scope: :member
      schema "rib_request"

      param :id, type: :integer, desc: "RIB request ID", required: true

      def execute(user_id:, workspace_id:, id:, **_)
        item = find_item!(id)

        { data: Core::Serializers::ItemSerializer.new(item).to_h }
      end
    end
  end
end
