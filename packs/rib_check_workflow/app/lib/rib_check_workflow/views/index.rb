# frozen_string_literal: true

module RibCheckWorkflow
  module Views
    class Index
      include Ui::Views::BaseView

      view do
        url "/api/v1/workspaces/rib_requests"

        api do |a|
          a.index method: :get, path: ""
          a.show method: :get, path: ":id"
          a.create method: :post, path: ""
          a.update method: :patch, path: ":id"
          a.destroy method: :delete, path: ":id"
          a.cancel method: :post, path: ":id/cancel"
        end

        translations(
          en: {
            page_title: "RIB Requests",
            page_description: "Manage RIB collection requests",
            new_request: "New Request",
            edit_request: "Edit Request",
            search_placeholder: "Search requests...",
            actions: "Actions",
            view_request: "View Request",
            edit: "Edit",
            delete: "Delete",
            cancel_request: "Cancel Request",
            delete_confirm: "Are you sure you want to delete this RIB request?",
            cancel_confirm: "Are you sure you want to cancel this RIB request?",
            created_at: "Created At",
            status: "Status",
            request_type: "Type",
            deadline: "Deadline",
            recipients: "Recipients",
            request_created: "RIB request created successfully",
            request_create_failed: "Failed to create RIB request",
            request_updated: "RIB request updated successfully",
            request_update_failed: "Failed to update RIB request",
            request_deleted: "RIB request deleted successfully",
            request_delete_failed: "Failed to delete RIB request",
            request_cancelled: "RIB request cancelled successfully",
            request_cancel_failed: "Failed to cancel RIB request",
            draft: "Draft",
            pending: "Pending",
            partial: "Partial",
            completed: "Completed",
            cancelled: "Cancelled",
            individual: "Individual",
            common: "Common"
          },
          fr: {
            page_title: "Demandes RIB",
            page_description: "Gerer les demandes de collecte RIB",
            new_request: "Nouvelle Demande",
            edit_request: "Modifier la Demande",
            search_placeholder: "Rechercher des demandes...",
            actions: "Actions",
            view_request: "Voir la Demande",
            edit: "Modifier",
            delete: "Supprimer",
            cancel_request: "Annuler la Demande",
            delete_confirm: "Etes-vous sur de vouloir supprimer cette demande RIB?",
            cancel_confirm: "Etes-vous sur de vouloir annuler cette demande RIB?",
            created_at: "Cree le",
            status: "Statut",
            request_type: "Type",
            deadline: "Echeance",
            recipients: "Destinataires",
            request_created: "Demande RIB creee avec succes",
            request_create_failed: "Echec de la creation de la demande RIB",
            request_updated: "Demande RIB mise a jour avec succes",
            request_update_failed: "Echec de la mise a jour de la demande RIB",
            request_deleted: "Demande RIB supprimee avec succes",
            request_delete_failed: "Echec de la suppression de la demande RIB",
            request_cancelled: "Demande RIB annulee avec succes",
            request_cancel_failed: "Echec de l'annulation de la demande RIB",
            draft: "Brouillon",
            pending: "En attente",
            partial: "Partiel",
            completed: "Complete",
            cancelled: "Annule",
            individual: "Individuel",
            common: "Commun"
          }
        )

        drawers do |d|
          d.drawer(:new_drawer, className: "w-1/2") do |drawer|
            drawer.title "new_request"
            drawer.body Form, action: :save, use_record: true, notification: {
              success: "request_created",
              error: "request_create_failed"
            }
          end

          d.drawer(:edit_drawer, className: "w-1/2") do |drawer|
            drawer.title "edit_request"
            drawer.body Form, action: :save, use_record: true, notification: {
              success: "request_updated",
              error: "request_update_failed"
            }
          end

          d.drawer(:view_drawer, className: "w-1/2") do |drawer|
            drawer.title "view_request"
            drawer.body Show, use_record: true
          end
        end

        page(classname: "bg-slate-50") do |c|
          c.title "page_title"
          c.description "page_description"

          c.actions do
            link "new_request", opens: :new_drawer, variant: "primary"
          end

          c.body do
            group(classname: "flex flex-col space-y-6 p-6") do
              table(
                classname: "bg-white rounded-lg border",
                selectable: false,
                searchable: true,
                search_placeholder: "search_placeholder",
                toggle_columns: true,
                page_size: 10
              ) do |t|
                t.column :status, type: "DISPLAY_BADGE", label: "status", sortable: true, options: [
                  { label: "draft", value: "draft", variant: "secondary" },
                  { label: "pending", value: "pending", variant: "warning" },
                  { label: "partial", value: "partial", variant: "info" },
                  { label: "completed", value: "completed", variant: "success" },
                  { label: "cancelled", value: "cancelled", variant: "destructive" }
                ]
                t.column :request_type, type: "DISPLAY_SELECT", label: "request_type", sortable: true, options: [
                  { label: "individual", value: "individual" },
                  { label: "common", value: "common" }
                ]
                t.column :message_body, type: "DISPLAY_TEXT", label: "message_body"
                t.column :end_at, type: "DISPLAY_DATE", label: "deadline", sortable: true
                t.column :created_at, type: "DISPLAY_DATE", label: "created_at", sortable: true

                t.row_click opens: :view_drawer

                t.row_actions icon: "ellipsis" do
                  link :edit, opens: :edit_drawer, icon: "pencil"
                  link :cancel_request,
                    api: :cancel,
                    confirm: "cancel_confirm",
                    icon: "x-circle",
                    notification: {
                      success: "request_cancelled",
                      error: "request_cancel_failed"
                    }
                  link :delete,
                    api: :destroy,
                    confirm: "delete_confirm",
                    icon: "trash",
                    notification: {
                      success: "request_deleted",
                      error: "request_delete_failed"
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
