# frozen_string_literal: true

module Core
  module Schemas
    class PhoneSchema < Core::Schema::Base
      title "Phone"
      slug "phone"
      description "Phone number"

      string :label, max_length: 255, required: false, description: "Phone label (Mobile, Home, Work, etc)"
      string :number, max_length: 50, description: "Phone number"
      string :country_code, max_length: 10, required: false, description: "Country code (e.g., +1, +33)"
      string :extension, max_length: 20, required: false, description: "Extension number"
      boolean :is_primary, required: false, description: "Primary phone flag"

      timestamps

      relationships do
        belongs_to :contact, schema: :contact, inverse: :phones
      end

      translations(
        en: {
          label: "Label",
          number: "Phone Number",
          country_code: "Country Code",
          extension: "Extension",
          is_primary: "Primary Phone"
        },
        fr: {
          label: "Libellé",
          number: "Numéro de Téléphone",
          country_code: "Indicatif Pays",
          extension: "Extension",
          is_primary: "Téléphone Principal"
        }
      )
    end
  end
end
