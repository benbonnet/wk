# frozen_string_literal: true

require "rails_helper"

RSpec.describe ContactsService::Views::Form do
  subject(:config) { described_class.view_config_raw }

  let(:form) { config[:elements]&.find { |e| e[:type] == "FORM" } }
  let(:wrapper) { form[:elements]&.first }

  describe "structure" do
    it { expect(config).to include(type: "VIEW") }
    it { expect(config[:elements]).to include(a_hash_including(type: "FORM")) }
  end

  describe "form groups" do
    it { expect(wrapper[:elements]).to include(a_hash_including(type: "GROUP", label: "basic_info")) }
    it { expect(wrapper[:elements]).to include(a_hash_including(type: "GROUP", label: "contact_info")) }
    it { expect(wrapper[:elements]).to include(a_hash_including(type: "GROUP", label: "professional_info")) }
    it { expect(wrapper[:elements]).to include(a_hash_including(type: "GROUP", label: "personal_info")) }
  end

  describe "form fields" do
    let(:basic_info) { wrapper[:elements]&.find { |e| e[:type] == "GROUP" && e[:label] == "basic_info" } }

    it "has first_name field" do
      expect(basic_info[:elements]).to include(a_hash_including(name: "first_name", type: "INPUT_TEXT"))
    end

    it "has last_name field" do
      expect(basic_info[:elements]).to include(a_hash_including(name: "last_name", type: "INPUT_TEXT"))
    end
  end

  describe "emails form_array" do
    let(:contact_info) { wrapper[:elements]&.find { |e| e[:type] == "GROUP" && e[:label] == "contact_info" } }
    let(:emails) { contact_info[:elements]&.find { |e| e[:type] == "FORM_ARRAY" && e[:name] == "emails_attributes" } }

    it { expect(emails).to be_present }
    it { expect(emails).to include(label: "emails", addLabel: "add_email", removeLabel: "remove") }

    it "has template fields" do
      expect(emails[:template]).to include(
        a_hash_including(name: "address", type: "INPUT_TEXT"),
        a_hash_including(name: "label", type: "INPUT_TEXT"),
        a_hash_including(name: "is_primary", type: "INPUT_CHECKBOX")
      )
    end
  end

  describe "phones form_array" do
    let(:contact_info) { wrapper[:elements]&.find { |e| e[:type] == "GROUP" && e[:label] == "contact_info" } }
    let(:phones) { contact_info[:elements]&.find { |e| e[:type] == "FORM_ARRAY" && e[:name] == "phones_attributes" } }

    it { expect(phones).to be_present }
    it { expect(phones).to include(label: "phones", addLabel: "add_phone", removeLabel: "remove") }

    it "has template fields" do
      expect(phones[:template]).to include(
        a_hash_including(name: "number", type: "INPUT_TEXT"),
        a_hash_including(name: "label", type: "INPUT_TEXT"),
        a_hash_including(name: "is_primary", type: "INPUT_CHECKBOX")
      )
    end
  end

  describe "addresses form_array" do
    let(:addresses_group) { wrapper[:elements]&.find { |e| e[:type] == "GROUP" && e[:label] == "addresses" } }
    let(:addresses) { addresses_group[:elements]&.find { |e| e[:type] == "FORM_ARRAY" && e[:name] == "addresses_attributes" } }

    it { expect(addresses).to be_present }
    it { expect(addresses).to include(addLabel: "add_address", removeLabel: "remove") }

    it "has template fields" do
      expect(addresses[:template]).to include(
        a_hash_including(name: "label", type: "INPUT_TEXT"),
        a_hash_including(name: "address_line_1", type: "INPUT_TEXT"),
        a_hash_including(name: "city", type: "INPUT_TEXT"),
        a_hash_including(name: "postal_code", type: "INPUT_TEXT"),
        a_hash_including(name: "country", type: "INPUT_TEXT")
      )
    end
  end

  describe "spouse relationship" do
    let(:spouse) { wrapper[:elements]&.find { |e| e[:type] == "GROUP" && e[:name] == "spouse_attributes" } }

    it { expect(spouse).to be_present }
    it { expect(spouse).to include(label: "spouse") }

    it "has first_name field" do
      expect(spouse[:elements]).to include(
        a_hash_including(name: "spouse_attributes.first_name", type: "INPUT_TEXT", label: "first_name")
      )
    end

    it "has last_name field" do
      expect(spouse[:elements]).to include(
        a_hash_including(name: "spouse_attributes.last_name", type: "INPUT_TEXT", label: "last_name")
      )
    end
  end

  describe "children relationship picker" do
    let(:picker) { wrapper[:elements]&.find { |e| e[:type] == "RELATIONSHIP_PICKER" && e[:name] == "children_attributes" } }

    it { expect(picker).to be_present }
    it { expect(picker).to include(cardinality: :many, relationSchema: "contact") }

    it "has template fields" do
      field_names = picker[:template].map { |f| f[:name] }
      expect(field_names).to include("first_name", "last_name")
    end
  end

  describe "submit button" do
    let(:footer) { form[:elements]&.last }
    let(:submit) { footer[:elements]&.find { |e| e[:type] == "SUBMIT" } }

    it { expect(submit).to include(label: "save", loadingLabel: "saving") }
  end

  describe "translations" do
    it { expect(config[:translations]).to have_key(:en) }
    it { expect(config[:translations]).to have_key(:fr) }

    it "includes group label translations" do
      expect(config[:translations][:en]).to include(
        basic_info: "Basic Information",
        contact_info: "Contact Information",
        professional_info: "Professional Information"
      )
    end

    it "includes button translations" do
      expect(config[:translations][:en]).to include(save: "Save", saving: "Saving...")
    end

    it "includes email/phone translations" do
      expect(config[:translations][:en]).to include(
        emails: "Emails",
        add_email: "Add Email",
        phones: "Phones",
        add_phone: "Add Phone",
        is_primary: "Primary"
      )
    end

    it "includes french translations" do
      expect(config[:translations][:fr]).to include(
        emails: "Emails",
        add_email: "Ajouter un email",
        phones: "Téléphones",
        add_phone: "Ajouter un téléphone",
        is_primary: "Principal"
      )
    end
  end
end
