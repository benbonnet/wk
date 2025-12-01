# frozen_string_literal: true

module ContactsService
  class ContactSerializer < Core::Serializers::BaseItemSerializer
    schema ContactSchema

    # Computed attributes
    attribute :full_name do |item|
      [item.data&.dig("first_name"), item.data&.dig("last_name")].compact.join(" ")
    end

    attribute :primary_email do |item|
      emails = ItemRelationship
        .where(source_item_id: item.id, relationship_type: "emails")
        .includes(:target_item)
        .filter_map(&:target_item)

      emails.find { |e| e.data&.dig("is_primary") }&.data&.dig("address")
    end

    attribute :primary_phone do |item|
      phones = ItemRelationship
        .where(source_item_id: item.id, relationship_type: "phones")
        .includes(:target_item)
        .filter_map(&:target_item)

      phones.find { |p| p.data&.dig("is_primary") }&.data&.dig("number")
    end
  end
end
