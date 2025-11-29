# frozen_string_literal: true

module RibCheckWorkflow
  module Views
    class Show
      include Ui::Views::BaseView

      view do
        translations(
          en: {
            request_details: "Request Details",
            notification_settings: "Notification Settings",
            recipients_section: "Recipients",
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
            draft: "Brouillon",
            pending: "En attente",
            partial: "Partiel",
            completed: "Complete",
            cancelled: "Annule",
            individual: "Individuel",
            common: "Commun"
          }
        )

        show(className: "flex flex-col p-6 space-y-8") do
          group label: "request_details", className: "space-y-4" do
            render :status, type: "DISPLAY_BADGE", label: "status", options: [
              { label: "draft", value: "draft", variant: "secondary" },
              { label: "pending", value: "pending", variant: "warning" },
              { label: "partial", value: "partial", variant: "info" },
              { label: "completed", value: "completed", variant: "success" },
              { label: "cancelled", value: "cancelled", variant: "destructive" }
            ]
            render :request_type, type: "DISPLAY_SELECT", label: "request_type", options: [
              { label: "individual", value: "individual" },
              { label: "common", value: "common" }
            ]
            render :end_at, type: "DISPLAY_DATETIME", label: "end_at"
            render :message_body, type: "DISPLAY_LONGTEXT", label: "message_body"
            render :comment, type: "DISPLAY_LONGTEXT", label: "comment"
          end

          group label: "notification_settings", className: "space-y-4" do
            render :notify_via_email, type: "DISPLAY_BOOLEAN", label: "notify_via_email"
            render :notify_via_sms, type: "DISPLAY_BOOLEAN", label: "notify_via_sms"
          end

          display_array :recipients, label: "recipients_section" do
            render :first_name, type: "DISPLAY_TEXT", label: "first_name"
            render :last_name, type: "DISPLAY_TEXT", label: "last_name"
            render :email, type: "DISPLAY_TEXT", label: "email"
          end
        end
      end
    end
  end
end
