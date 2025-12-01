# frozen_string_literal: true

module RibCheckService
  module Tools
    class Create < Core::Tools::Base
      description "Create a RIB request"
      route method: :post, scope: :collection
      schema "rib_request"

      params do
        object :data, of: RibRequestSchema
      end

      def execute(user_id:, workspace_id:, data: {}, **_)
        item_id = nil
        invites = []

        ActiveRecord::Base.transaction do
          # 1. Create the item
          item_result = ItemsService::Tools::Create.execute(
            user_id:,
            workspace_id:,
            schema_slug: "rib_request",
            tool_slug: "create",
            data:
          )

          item_id = item_result["id"]

          # 2. Create invites for recipients
          recipients = data[:recipients_attributes] || data["recipients_attributes"] || []
          recipients.each do |recipient|
            invite = InvitesService::Tools::Create.execute(
              user_id:,
              workspace_id:,
              inviter_id: user_id,
              invitee_id: recipient[:id] || recipient["id"],
              recipient_workspace_id: workspace_id,
              status: "pending",
              item_ids: [item_id]
            )
            invites << invite
          end

          # 3. Create activity
          ActivitiesService::Tools::Create.execute(
            user_id:,
            workspace_id:,
            activity_type: "user_action",
            category: "data_access",
            level: "info",
            message: "Created RIB request",
            item_id:,
            schema_slug: "rib_request",
            tool_slug: "create",
            metadata: { data: item_result, invites_count: invites.size }
          )
        end

        {
          data: RibRequestSerializer.new(Item.find(item_id)).to_h,
          meta: { created: true, invites_count: invites.size }
        }
      end
    end
  end
end
