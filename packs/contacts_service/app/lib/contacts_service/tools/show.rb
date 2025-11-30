# frozen_string_literal: true

module ContactsService
  module Tools
    class Show < Core::Tools::Base
      route method: :get, scope: :member
      schema "contact"

      def execute(id:, **_)
        item = find_item!(id)

        { data: Core::Serializers::ItemSerializer.new(item).to_h }
      end
    end
  end
end
