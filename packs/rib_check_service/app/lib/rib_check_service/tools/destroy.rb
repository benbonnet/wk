# frozen_string_literal: true

module RibCheckService
  module Tools
    class Destroy < Core::Tools::Base
      description "Soft delete a RIB request"
      route method: :delete, scope: :member
      schema "rib_request"

      param :id, type: :integer, desc: "RIB request ID", required: true

      def execute(user_id:, workspace_id:, id:, **_)
        item = find_item!(id)

        item.update!(
          deleted_at: Time.current,
          deleted_by_id: user_id
        )

        { meta: { deleted: true, id: } }
      end
    end
  end
end
