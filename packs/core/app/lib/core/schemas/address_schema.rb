# frozen_string_literal: true

module Core
  module Schemas
    class AddressSchema < Core::Schema::Base
      title "Address"
      slug "address"
      description "Physical address"

      string :label, max_length: 255, required: false, description: "Address label (Home, Work, etc)"
      string :address_line_1, max_length: 255, description: "Address line 1"
      string :address_line_2, max_length: 255, required: false, description: "Address line 2"
      string :city, max_length: 255, description: "City"
      string :state_province, max_length: 255, required: false, description: "State or province"
      string :postal_code, max_length: 50, required: false, description: "Postal code"
      string :country, max_length: 255, required: false, description: "Country"
      boolean :is_primary, required: false, description: "Primary address flag"

      timestamps

      relationships do
        belongs_to :contact, schema: :contact, inverse: :addresses
      end

      translations(
        en: {
          label: "Label",
          address_line_1: "Address Line 1",
          address_line_2: "Address Line 2",
          city: "City",
          state_province: "State/Province",
          postal_code: "Postal Code",
          country: "Country",
          is_primary: "Primary Address",
          contact: "Contact"
        },
        fr: {
          label: "Libellé",
          address_line_1: "Adresse Ligne 1",
          address_line_2: "Adresse Ligne 2",
          city: "Ville",
          state_province: "État/Province",
          postal_code: "Code Postal",
          country: "Pays",
          is_primary: "Adresse Principale",
          contact: "Contact"
        }
      )
    end
  end
end
