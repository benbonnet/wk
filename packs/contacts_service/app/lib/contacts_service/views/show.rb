# frozen_string_literal: true

module ContactsService
  module Views
    class Show
      include Ui::Views::BaseView

      view do
        translations(
          en: {
            basic_info: "Basic Information",
            professional_info: "Professional Information",
            personal_info: "Personal Information",
            tags_section: "Tags",
            addresses_section: "Addresses",
            male: "Male",
            female: "Female",
            other: "Other",
            prefer_not_to_say: "Prefer not to say"
          },
          fr: {
            basic_info: "Informations de Base",
            professional_info: "Informations Professionnelles",
            personal_info: "Informations Personnelles",
            tags_section: "Tags",
            addresses_section: "Adresses",
            male: "Homme",
            female: "Femme",
            other: "Autre",
            prefer_not_to_say: "Prefere ne pas dire"
          }
        )

        show(className: "flex flex-col p-6 space-y-8") do
          group label: "basic_info", className: "space-y-4" do
            render :first_name, type: "DISPLAY_TEXT", label: "first_name"
            render :middle_name, type: "DISPLAY_TEXT", label: "middle_name"
            render :last_name, type: "DISPLAY_TEXT", label: "last_name"
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
            render :place_of_birth, type: "DISPLAY_TEXT", label: "place_of_birth"
            render :nationality, type: "DISPLAY_TEXT", label: "nationality"
          end

          group label: "tags_section", className: "space-y-4" do
            render :tags, type: "DISPLAY_TAGS", label: "tags"
          end

          display_array :addresses, label: "addresses_section" do
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
