# frozen_string_literal: true

module Core
  module HasNestedAttributes
    extend ActiveSupport::Concern

    included do
      attr_accessor :_raw_data_with_nested

      after_commit :process_pending_nested_attributes, on: [:create, :update]
    end

    # Override data= to capture nested attributes
    def data=(value)
      return super(value) unless value.is_a?(Hash)

      # Store raw data for after_commit processing
      self._raw_data_with_nested = value.dup

      # Set clean data (without nested attributes)
      super(value.reject { |k, _| k.to_s.end_with?("_attributes") })
    end

    private

      def process_pending_nested_attributes
        return unless _raw_data_with_nested.present?

        method = previously_new_record? ? :process_create : :process_update

        Core::Processors::NestedAttributesProcessor.public_send(
          method,
          source_schema: schema_slug,
          source_item_id: id,
          data: _raw_data_with_nested,
          workspace_id:,
          user_id: created_by_id
        )

        self._raw_data_with_nested = nil
      end
  end
end
