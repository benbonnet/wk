# frozen_string_literal: true

require "rails_helper"

RSpec.describe RibCheckWorkflow::RibRequestSchema do
  subject(:schema_class) { described_class }

  describe "metadata" do
    it { expect(schema_class.title).to eq("RIB Request") }
    it { expect(schema_class.description).to eq("Request for bank account details (RIB) from contacts") }
    it { expect(schema_class.slug).to eq("rib_request") }
  end

  describe "fields" do
    subject(:properties) { schema_class.new.to_json_schema.dig(:schema, :properties) }

    it { expect(properties).to have_key(:comment) }
    it { expect(properties).to have_key(:message_body) }
    it { expect(properties).to have_key(:end_at) }

    it "has end_at with date-time format" do
      expect(properties[:end_at]).to include(format: "date-time")
    end

    it { expect(properties).to have_key(:notify_via_email) }
    it { expect(properties).to have_key(:notify_via_sms) }

    it "has request_type with enum" do
      expect(properties[:request_type]).to include(enum: %w[individual common])
    end

    it "has status with enum" do
      expect(properties[:status]).to include(enum: %w[draft pending partial completed cancelled])
    end

    it "has timestamps" do
      expect(properties[:created_at]).to include(format: "date-time")
      expect(properties[:updated_at]).to include(format: "date-time")
    end

    it "has soft delete" do
      expect(properties[:deleted_at]).to include(format: "date-time")
    end
  end

  describe "relationships" do
    subject(:relationships) { schema_class.relationships }

    it "has recipients relationship" do
      expect(relationships).to include(
        a_hash_including(name: :recipients, cardinality: :many, target_schema: "contact", inverse_name: :rib_requests)
      )
    end

    it "has documents relationship" do
      expect(relationships).to include(
        a_hash_including(name: :documents, cardinality: :many, target_schema: "document", inverse_name: :rib_request)
      )
    end

    describe "helper methods" do
      it { expect(schema_class.has_relationship?(:recipients)).to be true }
      it { expect(schema_class.has_relationship?(:documents)).to be true }
      it { expect(schema_class.has_relationship?(:nonexistent)).to be false }

      it "find_relationship returns the relationship" do
        expect(schema_class.find_relationship(:recipients)).to include(name: :recipients, cardinality: :many)
      end
    end
  end

  describe "translations" do
    subject(:translations) { schema_class.translations }

    it { expect(translations).to have_key(:en) }
    it { expect(translations).to have_key(:fr) }

    it "includes field translations in english" do
      expect(translations[:en]).to include(
        comment: "Internal Comment",
        message_body: "Message",
        end_at: "Deadline",
        notify_via_email: "Email Notification",
        notify_via_sms: "SMS Notification",
        request_type: "Request Type",
        status: "Status"
      )
    end

    it "includes relationship translations in english" do
      expect(translations[:en]).to include(recipients: "Recipients", documents: "Documents")
    end

    it "includes field translations in french" do
      expect(translations[:fr]).to include(
        comment: "Commentaire interne",
        message_body: "Message",
        request_type: "Type de demande",
        status: "Statut"
      )
    end

    it "includes relationship translations in french" do
      expect(translations[:fr]).to include(recipients: "Destinataires", documents: "Documents")
    end
  end
end
