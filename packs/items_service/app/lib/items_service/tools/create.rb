# frozen_string_literal: true

module ItemsService
  module Tools
    class Create < Core::Tools::Base
      description "Create a generic item record"
      # No route - workflow only

      params do
        string :schema_slug, description: "Schema type for the item"
        string :tool_slug, description: "Tool that created this item"
        object :data, description: "Item data" do
          additional_properties true
        end
      end

      def execute(
        user_id:,
        workspace_id:,
        schema_slug:,
        tool_slug:,
        data:,
        **_
      )
        item = Item.create!(
          schema_slug:,
          tool_slug:,
          data:,
          created_by_id: user_id,
          workspace_id:
        )

        Core::Serializers::ItemSerializer.new(item).to_h
      end
    end
  end
end
