# frozen_string_literal: true

module ItemsService
  module Tools
    class Update < Core::Tools::Base
      description "Update a generic item record"
      # No route - workflow only

      params do
        string :id, description: "Item ID"
        object :data, description: "Item data to merge" do
          additional_properties true
        end
      end

      def execute(user_id:, workspace_id:, id:, data:, **_)
        item = scoped(Item).find(id)

        item.update!(
          data: item.data.merge(data.stringify_keys),
          updated_by_id: user_id
        )

        Core::Serializers::ItemSerializer.new(item).to_h
      end
    end
  end
end
