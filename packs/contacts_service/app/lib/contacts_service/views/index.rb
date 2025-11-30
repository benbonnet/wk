# frozen_string_literal: true

module ContactsService
  module Views
    class Index
      include Ui::Views::BaseView

      view do
        url "/api/v1/workspaces/contacts"

        api do |a|
          a.index method: :get, path: ""
          a.show method: :get, path: ":id"
          a.create method: :post, path: ""
          a.update method: :patch, path: ":id"
          a.destroy method: :delete, path: ":id"
        end

        translations(
          en: {
            page_title: "Contacts",
            page_description: "Manage your contacts",
            new_contact: "New Contact",
            edit_contact: "Edit Contact",
            search_placeholder: "Search contacts...",
            actions: "Actions",
            export_csv: "Export CSV",
            import: "Import",
            view_contact: "View Contact",
            edit: "Edit",
            delete: "Delete",
            delete_confirm: "Are you sure you want to delete this contact?",
            created_at: "Created At",
            email: "Email",
            phone: "Phone",
            contact_created: "Contact created successfully",
            contact_create_failed: "Failed to create contact",
            contact_updated: "Contact updated successfully",
            contact_update_failed: "Failed to update contact",
            contact_deleted: "Contact deleted successfully",
            contact_delete_failed: "Failed to delete contact",
            bulk_delete: "Delete Selected",
            bulk_export: "Export Selected",
            bulk_delete_confirm: "Are you sure you want to delete %{count} contacts?",
            contacts_deleted: "%{count} contacts deleted successfully",
            contacts_delete_failed: "Failed to delete contacts",
            contacts_exported: "%{count} contacts exported successfully",
            contacts_export_failed: "Failed to export contacts"
          },
          fr: {
            page_title: "Contacts",
            page_description: "Gerez vos contacts",
            new_contact: "Nouveau Contact",
            edit_contact: "Modifier le Contact",
            search_placeholder: "Rechercher des contacts...",
            actions: "Actions",
            export_csv: "Exporter CSV",
            import: "Importer",
            view_contact: "Voir le Contact",
            edit: "Modifier",
            delete: "Supprimer",
            delete_confirm: "Etes-vous sur de vouloir supprimer ce contact?",
            created_at: "Cree le",
            email: "Email",
            phone: "Telephone",
            contact_created: "Contact cree avec succes",
            contact_create_failed: "Echec de la creation du contact",
            contact_updated: "Contact mis a jour avec succes",
            contact_update_failed: "Echec de la mise a jour du contact",
            contact_deleted: "Contact supprime avec succes",
            contact_delete_failed: "Echec de la suppression du contact",
            bulk_delete: "Supprimer la selection",
            bulk_export: "Exporter la selection",
            bulk_delete_confirm: "Etes-vous sur de vouloir supprimer %{count} contacts?",
            contacts_deleted: "%{count} contacts supprimes avec succes",
            contacts_delete_failed: "Echec de la suppression des contacts",
            contacts_exported: "%{count} contacts exportes avec succes",
            contacts_export_failed: "Echec de l'exportation des contacts"
          }
        )

        drawers do |d|
          d.drawer(:new_drawer, className: "w-1/2") do |drawer|
            drawer.title "new_contact"
            drawer.body Form, action: :save, use_record: true, notification: {
              success: "contact_created",
              error: "contact_create_failed"
            }
          end

          d.drawer(:edit_drawer, className: "w-1/2") do |drawer|
            drawer.title "edit_contact"
            drawer.body Form, action: :save, use_record: true, notification: {
              success: "contact_updated",
              error: "contact_update_failed"
            }
          end

          d.drawer(:view_drawer, className: "w-1/2") do |drawer|
            drawer.title "view_contact"
            drawer.body Show, use_record: true
          end
        end

        page(classname: "bg-slate-50") do |c|
          c.title "page_title"
          c.description "page_description"

          c.actions do
            link "new_contact", opens: :new_drawer, variant: "primary"
            dropdown label: "actions", searchable: false do
              option "export_csv", href: "/contacts/export?format=csv"
              option "import", href: "/contacts/import"
            end
          end

          c.body do
            group(classname: "flex flex-col space-y-6 p-6") do
              table(
                classname: "bg-white rounded-lg border",
                selectable: true,
                searchable: true,
                search_placeholder: "search_placeholder",
                toggle_columns: true,
                page_size: 10
              ) do |t|
                t.column :first_name, type: "DISPLAY_TEXT", label: "first_name", sortable: true
                t.column :last_name, type: "DISPLAY_TEXT", label: "last_name", sortable: true
                t.column :email, type: "DISPLAY_TEXT", label: "email", sortable: true
                t.column :phone, type: "DISPLAY_TEXT", label: "phone"
                t.column :company, type: "DISPLAY_TEXT", label: "company"
                t.column :job_title, type: "DISPLAY_TEXT", label: "job_title"
                t.column :created_at, type: "DISPLAY_DATE", label: "created_at"

                t.row_click opens: :view_drawer

                t.row_actions icon: "ellipsis" do
                  link :edit, opens: :edit_drawer, icon: "pencil"
                  link :delete,
                    api: :destroy,
                    confirm: "delete_confirm",
                    icon: "trash",
                    notification: {
                      success: "contact_deleted",
                      error: "contact_delete_failed"
                    }
                end

                t.bulk_actions do
                  link :bulk_delete,
                    api: :bulk_destroy,
                    confirm: "bulk_delete_confirm",
                    icon: "trash",
                    variant: "destructive",
                    notification: {
                      success: "contacts_deleted",
                      error: "contacts_delete_failed"
                    }
                  link :bulk_export,
                    api: :bulk_export,
                    icon: "download",
                    notification: {
                      success: "contacts_exported",
                      error: "contacts_export_failed"
                    }
                end
              end
            end
          end
        end
      end
    end
  end
end
