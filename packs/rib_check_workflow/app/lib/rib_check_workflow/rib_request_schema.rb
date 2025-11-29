# frozen_string_literal: true

module RibCheckWorkflow
  class RibRequestSchema < Core::Schema::Base
    title "RIB Request"
    slug "rib_request"
    description "Request for bank account details (RIB) from contacts"

    # Fields
    string :comment, required: false, description: "Internal note"
    string :message_body, required: false, description: "Notification message"
    string :end_at, format: "date-time", required: false, description: "Deadline"
    boolean :notify_via_email, required: false, description: "Send email notification"
    boolean :notify_via_sms, required: false, description: "Send SMS notification"
    string :request_type, enum: %w[individual common], description: "Request type"
    string :status, enum: %w[draft pending partial completed cancelled], description: "Status"

    timestamps
    soft_delete

    # Relationships
    relationships do
      has_many :recipients, schema: :contact, inverse: :rib_requests
      has_many :documents, schema: :document, inverse: :rib_request
    end

    # Translations
    translations(
      en: {
        comment: "Internal Comment",
        message_body: "Message",
        end_at: "Deadline",
        notify_via_email: "Email Notification",
        notify_via_sms: "SMS Notification",
        request_type: "Request Type",
        status: "Status",
        recipients: "Recipients",
        documents: "Documents"
      },
      fr: {
        comment: "Commentaire interne",
        message_body: "Message",
        end_at: "Echéance",
        notify_via_email: "Notification Email",
        notify_via_sms: "Notification SMS",
        request_type: "Type de demande",
        status: "Statut",
        recipients: "Destinataires",
        documents: "Documents"
      }
    )
  end
end
