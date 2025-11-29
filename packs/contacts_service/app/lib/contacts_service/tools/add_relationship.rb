# frozen_string_literal: true

module ContactsService
  module Tools
    class AddRelationship < Core::Tools::Base
      route method: :post, scope: :member, action: "relationships"
      schema "contact"

      def execute(user_id:, workspace_id:, id:, relationship_type:, target_id:, metadata: {}, **_)
        source = find_item!(id)
        target = scoped(Item).find(target_id)

        relationship = source.add_relationship(
          target,
          relationship_type,
          metadata:
        )

        {
          data: {
            id: relationship.id,
            relationship_type:,
            source_id: source.id,
            target_id: target.id
          },
          meta: { created: true }
        }
      end
    end
  end
end
