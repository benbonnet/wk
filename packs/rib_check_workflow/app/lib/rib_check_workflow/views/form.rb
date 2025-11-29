# frozen_string_literal: true

module RibCheckWorkflow
  module Views
    class Form
      include Ui::Views::BaseView

      schema RibCheckWorkflow::RibRequestSchema

      view do
        translations(
          en: {
            request_details: "Request Details",
            notification_settings: "Notification Settings",
            recipients_section: "Recipients",
            message_body_placeholder: "Enter the message to send to recipients...",
            comment_placeholder: "Internal notes (not visible to recipients)",
            save: "Save",
            saving: "Saving...",
            add_recipient: "Add Recipient",
            remove_recipient: "Remove",
            draft: "Draft",
            pending: "Pending",
            partial: "Partial",
            completed: "Completed",
            cancelled: "Cancelled",
            individual: "Individual",
            common: "Common"
          },
          fr: {
            request_details: "Details de la Demande",
            notification_settings: "Parametres de Notification",
            recipients_section: "Destinataires",
            message_body_placeholder: "Entrez le message a envoyer aux destinataires...",
            comment_placeholder: "Notes internes (non visibles par les destinataires)",
            save: "Sauvegarder",
            saving: "Sauvegarde...",
            add_recipient: "Ajouter un Destinataire",
            remove_recipient: "Supprimer",
            draft: "Brouillon",
            pending: "En attente",
            partial: "Partiel",
            completed: "Complete",
            cancelled: "Annule",
            individual: "Individuel",
            common: "Commun"
          }
        )

        form(classname: "flex flex-col h-full min-h-0") do
          group(classname: "flex flex-col flex-shrink min-h-0 overflow-y-scroll p-6 space-y-12") do
            group label: "request_details" do
              field :status, type: "INPUT_SELECT", label: "status", options: [
                { label: "draft", value: "draft" },
                { label: "pending", value: "pending" },
                { label: "partial", value: "partial" },
                { label: "completed", value: "completed" },
                { label: "cancelled", value: "cancelled" }
              ]
              field :request_type, type: "INPUT_SELECT", label: "request_type", options: [
                { label: "individual", value: "individual" },
                { label: "common", value: "common" }
              ]
              field :end_at, type: "INPUT_DATETIME", label: "end_at"
              field :message_body, type: "INPUT_TEXTAREA", label: "message_body", placeholder: "message_body_placeholder"
              field :comment, type: "INPUT_TEXTAREA", label: "comment", placeholder: "comment_placeholder"
            end

            group label: "notification_settings" do
              field :notify_via_email, type: "INPUT_CHECKBOX", label: "notify_via_email"
              field :notify_via_sms, type: "INPUT_CHECKBOX", label: "notify_via_sms"
            end

            relationship_picker(:recipients, cardinality: :many, relation_schema: "contact") do |r|
              r.display do
                render :first_name, type: "DISPLAY_TEXT"
                render :last_name, type: "DISPLAY_TEXT"
                render :email, type: "DISPLAY_TEXT"
              end

              r.form do
                field :first_name, type: "INPUT_TEXT", label: "first_name"
                field :last_name, type: "INPUT_TEXT", label: "last_name"
                field :email, type: "INPUT_TEXT", label: "email"
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
