# frozen_string_literal: true

module ContactsService
  module Tools
    class Update < Core::Tools::Base
      route method: :put, scope: :member
      schema "contact"

      def execute(id:, contact: {}, **_)
        item = find_item!(id)

        item.update!(
          data: item.data.merge(contact.stringify_keys),
          updated_by: current_user
        )

        { data: Core::Serializers::ItemSerializer.new(item).to_h, meta: { updated: true } }
      end
    end
  end
end
