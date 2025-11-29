# frozen_string_literal: true

module ContactsService
  module Tools
    class Destroy < Core::Tools::Base
      route method: :delete, scope: :member
      schema "contact"

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
