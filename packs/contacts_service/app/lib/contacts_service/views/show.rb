# frozen_string_literal: true

module ContactsService
  module Views
    class Show
      include Ui::Views::BaseView

      frontend_route "/contacts/:id"

      view do
        translations(
          en: {
            basic_info: "Basic Information",
            contact_info: "Contact Information",
            professional_info: "Professional Information",
            personal_info: "Personal Information",
            tags_section: "Tags",
            addresses_section: "Addresses",
            emails_section: "Emails",
            phones_section: "Phones",
            male: "Male",
            female: "Female",
            other: "Other",
            prefer_not_to_say: "Prefer not to say",
            email_address: "Email",
            phone_number: "Phone",
            label: "Label",
            is_primary: "Primary"
          },
          fr: {
            basic_info: "Informations de Base",
            contact_info: "Coordonnées",
            professional_info: "Informations Professionnelles",
            personal_info: "Informations Personnelles",
            tags_section: "Tags",
            addresses_section: "Adresses",
            emails_section: "Emails",
            phones_section: "Téléphones",
            male: "Homme",
            female: "Femme",
            other: "Autre",
            prefer_not_to_say: "Préfère ne pas dire",
            email_address: "Email",
            phone_number: "Téléphone",
            label: "Libellé",
            is_primary: "Principal"
          }
        )

        show(className: "flex flex-col p-6 space-y-8") do
          group label: "basic_info", className: "space-y-4" do
            render :first_name, type: "DISPLAY_TEXT", label: "first_name"
            render :last_name, type: "DISPLAY_TEXT", label: "last_name"
          end

          group label: "contact_info", className: "space-y-4" do
            display_array :emails, label: "emails_section" do
              render :address, type: "DISPLAY_TEXT", label: "email_address"
              render :label, type: "DISPLAY_TEXT", label: "label"
              render :is_primary, type: "DISPLAY_BOOLEAN", label: "is_primary"
            end

            display_array :phones, label: "phones_section" do
              render :number, type: "DISPLAY_TEXT", label: "phone_number"
              render :label, type: "DISPLAY_TEXT", label: "label"
              render :is_primary, type: "DISPLAY_BOOLEAN", label: "is_primary"
            end
          end

          group label: "professional_info", className: "space-y-4" do
            render :company, type: "DISPLAY_TEXT", label: "company"
            render :job_title, type: "DISPLAY_TEXT", label: "job_title"
          end

          group label: "personal_info", className: "space-y-4" do
            render :gender, type: "DISPLAY_SELECT", label: "gender", options: [
              { label: "male", value: "male" },
              { label: "female", value: "female" },
              { label: "other", value: "other" },
              { label: "prefer_not_to_say", value: "prefer_not_to_say" }
            ]
            render :date_of_birth, type: "DISPLAY_DATE", label: "date_of_birth"
          end

          group label: "tags_section", className: "space-y-4" do
            render :tags, type: "DISPLAY_TAGS", label: "tags"
          end

          display_array :addresses, label: "addresses_section" do
            render :label, type: "DISPLAY_TEXT", label: "label"
            render :address_line_1, type: "DISPLAY_TEXT", label: "address_line_1"
            render :city, type: "DISPLAY_TEXT", label: "city"
            render :postal_code, type: "DISPLAY_TEXT", label: "postal_code"
            render :country, type: "DISPLAY_TEXT", label: "country"
          end
        end
      end
    end
  end
end
