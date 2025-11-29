# frozen_string_literal: true

module ContactsService
  module Tools
    class Create < Core::Tools::Base
      route method: :post, scope: :collection
      schema "contact"

      def execute(contact: {}, **_)
        validate!(contact)

        item = Item.create!(
          schema_slug: "contact",
          tool_slug: "create",
          data: contact,
          created_by: current_user,
          workspace: current_workspace
        )

        { data: Core::Serializers::ItemSerializer.new(item).to_h, meta: { created: true } }
      end

      private

        def validate!(data)
          data = data.to_h.with_indifferent_access
          errors = {}
          errors[:first_name] = "is required" if data[:first_name].blank?
          errors[:last_name] = "is required" if data[:last_name].blank?

          if errors.any?
            raise Core::Tools::ValidationError.new("Validation failed", errors)
          end
        end
    end
  end
end
