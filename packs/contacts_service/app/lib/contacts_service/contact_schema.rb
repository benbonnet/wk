# frozen_string_literal: true

module ContactsService
  class ContactSchema < Core::Schema::Base
    title "Contact"
    description "A contact record with personal information"

    # Basic fields
    string :first_name, description: "First name", max_length: 255
    string :last_name, description: "Last name", max_length: 255
    string :company, required: false
    string :job_title, required: false
    string :gender, enum: %w[male female other prefer_not_to_say], required: false
    string :date_of_birth, format: "date", required: false
    array :tags, of: :string, required: false

    # Common helpers
    timestamps
    soft_delete

    # Relationships
    relationships do
      has_one :spouse, schema: :contact, inverse: :spouse
      has_many :addresses, schema: :address, inverse: :contact
      has_many :children, schema: :contact, inverse: :parents
      has_many :parents, schema: :contact, inverse: :children
      has_many :phones, schema: :phone, inverse: :contact
      has_many :emails, schema: :email, inverse: :contact
    end

    # Translations
    translations(
      en: {
        first_name: "First Name",
        last_name: "Last Name",
        company: "Company",
        job_title: "Job Title",
        spouse: "Spouse",
        children: "Children",
        addresses: "Addresses",
        emails: "Emails",
        phones: "Phones"
      },
      fr: {
        first_name: "Prénom",
        last_name: "Nom",
        company: "Entreprise",
        job_title: "Poste",
        spouse: "Conjoint(e)",
        children: "Enfants",
        addresses: "Adresses",
        emails: "Emails",
        phones: "Téléphones"
      }
    )
  end
end
