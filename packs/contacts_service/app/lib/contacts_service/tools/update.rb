# frozen_string_literal: true

module ContactsService
  module Tools
    class Update < Core::Tools::Base
      description "Update an existing contact"
      route method: :put, scope: :member
      schema "contact"

      params do
        integer :id, required: true
        object :data, of: ContactSchema
      end

      def execute(user_id:, workspace_id:, id:, data: {}, **_)
        item = find_item!(id)
        item.update!(data: item.data.merge(data), updated_by_id: user_id)

        { data: Core::Serializers::ItemSerializer.new(item).to_h, meta: { updated: true } }
      end
    end
  end
end
