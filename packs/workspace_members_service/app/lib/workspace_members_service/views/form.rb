# frozen_string_literal: true

module WorkspaceMembersService
  module Views
    class Form
      include Ui::Views::BaseView

      schema WorkspaceMembersService::WorkspaceMemberSchema

      view do
        translations(
          en: {
            email: "Email Address",
            email_placeholder: "user@example.com",
            email_hint: "Enter the email address of the person you want to add",
            role: "Role",
            role_hint: "Select the permission level for this member",
            admin: "Admin",
            admin_description: "Full access to all features including member management",
            manager: "Manager",
            manager_description: "Can manage content and view team members",
            editor: "Editor",
            editor_description: "Can create and edit content only",
            save: "Save",
            saving: "Saving...",
            add: "Add Member",
            adding: "Adding..."
          },
          fr: {
            email: "Adresse Email",
            email_placeholder: "utilisateur@exemple.com",
            email_hint: "Entrez l'adresse email de la personne a ajouter",
            role: "Role",
            role_hint: "Selectionnez le niveau de permission pour ce membre",
            admin: "Admin",
            admin_description: "Acces complet a toutes les fonctionnalites",
            manager: "Manager",
            manager_description: "Peut gerer le contenu et voir les membres",
            editor: "Editeur",
            editor_description: "Peut creer et modifier le contenu uniquement",
            save: "Enregistrer",
            saving: "Enregistrement...",
            add: "Ajouter le membre",
            adding: "Ajout..."
          }
        )

        form(classname: "flex flex-col h-full min-h-0") do
          group(classname: "flex flex-col flex-shrink min-h-0 overflow-y-scroll p-6 space-y-6") do
            field :email,
              type: "INPUT_EMAIL",
              label: "email",
              placeholder: "email_placeholder",
              hint: "email_hint"

            field :role,
              type: "INPUT_SELECT",
              label: "role",
              hint: "role_hint",
              options: [
                { label: "admin", value: "admin", description: "admin_description" },
                { label: "manager", value: "manager", description: "manager_description" },
                { label: "editor", value: "editor", description: "editor_description" }
              ]
          end

          group(classname: "flex-shrink-0 py-3 px-6 border-t bg-white") do
            submit label: "save", loadingLabel: "saving", classname: "w-full justify-center"
          end
        end
      end
    end
  end
end
