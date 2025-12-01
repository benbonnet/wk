# frozen_string_literal: true

module Core
  module Schemas
    class EmailSchema < Core::Schema::Base
      title "Email"
      slug "email"
      description "Email address"

      string :label, max_length: 255, required: false, description: "Email label (Personal, Work, etc)"
      string :address, format: "email", description: "Email address"
      boolean :is_primary, required: false, description: "Primary email flag"

      timestamps

      relationships do
        belongs_to :contact, schema: :contact, inverse: :emails
      end

      translations(
        en: {
          label: "Label",
          address: "Email Address",
          is_primary: "Primary Email"
        },
        fr: {
          label: "Libellé",
          address: "Adresse Email",
          is_primary: "Email Principal"
        }
      )
    end
  end
end
