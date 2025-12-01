# frozen_string_literal: true

module ContactsService
  class ContactSerializer < Core::Serializers::BaseItemSerializer
    schema ContactSchema

    # Computed attributes
    attribute :full_name do |item|
      [item.data&.dig("first_name"), item.data&.dig("last_name")].compact.join(" ")
    end

    attribute :primary_email do |item|
      emails = relationship_items(item, :emails)
      emails.find { |e| e.data&.dig("is_primary") }&.data&.dig("address")
    end

    attribute :primary_phone do |item|
      phones = relationship_items(item, :phones)
      phones.find { |p| p.data&.dig("is_primary") }&.data&.dig("number")
    end

    attribute :spouse_full_name do |item|
      spouse = relationship_items(item, :spouse).first
      next nil unless spouse

      [spouse.data&.dig("first_name"), spouse.data&.dig("last_name")].compact.join(" ").presence
    end
  end
end
