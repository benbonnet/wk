# frozen_string_literal: true

module ContactsService
  module Tools
    class Show < Core::Tools::Base
      route method: :get, scope: :member
      schema "contact"

      param :id, type: :integer, desc: "Contact ID", required: true

      def execute(id:, **_)
        item = find_item!(id)

        { data: ContactSerializer.new(item).to_h }
      end
    end
  end
end
