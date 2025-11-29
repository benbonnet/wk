# frozen_string_literal: true

module ContactsService
  module Tools
    class Update < Core::Tools::Base
      description "Update an existing contact"
      route method: :put, scope: :member
      schema "contact"

      params ContactSchema

      def execute(user_id:, workspace_id:, id:, contact: {}, **_)
        item = find_item!(id)

        item.update!(
          data: item.data.merge(contact.stringify_keys),
          updated_by_id: user_id
        )

        { data: Core::Serializers::ItemSerializer.new(item).to_h, meta: { updated: true } }
      end
    end
  end
end
