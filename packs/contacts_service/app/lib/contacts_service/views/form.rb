# frozen_string_literal: true

module ContactsService
  module Views
    class Form
      include Ui::Views::BaseView

      schema ContactsService::ContactSchema

      view do
        translations(
          en: {
            basic_info: "Basic Information",
            professional_info: "Professional Information",
            personal_info: "Personal Information",
            first_name_placeholder: "Enter first name",
            last_name_placeholder: "Enter last name",
            company_placeholder: "Enter company",
            job_title_placeholder: "Enter job title",
            save: "Save",
            saving: "Saving...",
            spouse: "Spouse",
            addresses: "Addresses",
            add_address: "Add Address",
            remove_address: "Remove",
            label: "Label",
            address_line_1: "Address Line 1",
            city: "City",
            postal_code: "Postal Code",
            country: "Country"
          },
          fr: {
            basic_info: "Informations de Base",
            professional_info: "Informations Professionnelles",
            personal_info: "Informations Personnelles",
            first_name_placeholder: "Entrez le prenom",
            last_name_placeholder: "Entrez le nom",
            company_placeholder: "Entrez l'entreprise",
            job_title_placeholder: "Entrez le poste",
            save: "Sauvegarder",
            saving: "Sauvegarde...",
            spouse: "Conjoint(e)",
            addresses: "Adresses",
            add_address: "Ajouter une adresse",
            remove_address: "Supprimer",
            label: "Libellé",
            address_line_1: "Ligne d'adresse 1",
            city: "Ville",
            postal_code: "Code postal",
            country: "Pays"
          }
        )

        form(classname: "flex flex-col h-full min-h-0") do
          group(classname: "flex flex-col flex-shrink min-h-0 overflow-y-scroll p-6 space-y-12") do
            group label: "basic_info" do
              field :first_name, type: "INPUT_TEXT", label: "first_name", placeholder: "first_name_placeholder"
              field :last_name, type: "INPUT_TEXT", label: "last_name", placeholder: "last_name_placeholder"
              field :email, type: "INPUT_TEXT", label: "email"
              field :phone, type: "INPUT_TEXT", label: "phone"
            end

            group label: "professional_info" do
              field :company, type: "INPUT_TEXT", label: "company", placeholder: "company_placeholder"
              field :job_title, type: "INPUT_TEXT", label: "job_title", placeholder: "job_title_placeholder"
            end

            group label: "personal_info" do
              field :gender, type: "INPUT_SELECT", label: "gender", options: [
                { label: "male", value: "male" },
                { label: "female", value: "female" },
                { label: "other", value: "other" },
                { label: "prefer_not_to_say", value: "prefer_not_to_say" }
              ]
              field :date_of_birth, type: "INPUT_DATE", label: "date_of_birth"
            end

            # Relationships
            relationship(:spouse, label: "spouse") do
              field :first_name, type: "INPUT_TEXT", label: "first_name"
              field :last_name, type: "INPUT_TEXT", label: "last_name"
            end

            relationship(:addresses, label: "addresses", add_label: "add_address", remove_label: "remove_address") do
              field :label, type: "INPUT_TEXT", label: "label"
              field :address_line_1, type: "INPUT_TEXT", label: "address_line_1"
              field :city, type: "INPUT_TEXT", label: "city"
              field :postal_code, type: "INPUT_TEXT", label: "postal_code"
              field :country, type: "INPUT_TEXT", label: "country"
            end

            relationship_picker(:children, cardinality: :many, relation_schema: "contact") do |r|
              r.display do
                render :first_name, type: "DISPLAY_TEXT"
                render :last_name, type: "DISPLAY_TEXT"
              end

              r.form do
                field :first_name, type: "INPUT_TEXT", label: "first_name"
                field :last_name, type: "INPUT_TEXT", label: "last_name"
              end
            end
          end

          group(classname: "flex-shrink-0 py-3 px-6 border-t bg-white") do
            submit label: "save", loadingLabel: "saving", classname: "w-full justify-center"
          end
        end
      end
    end
  end
end
