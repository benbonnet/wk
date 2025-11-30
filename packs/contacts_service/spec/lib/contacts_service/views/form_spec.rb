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

    it "has email field" do
      expect(basic_info[:elements]).to include(a_hash_including(name: "email"))
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

  describe "addresses relationship" do
    let(:addresses) { wrapper[:elements]&.find { |e| e[:type] == "FORM_ARRAY" && e[:name] == "addresses_attributes" } }

    it { expect(addresses).to be_present }
    it { expect(addresses).to include(label: "addresses", addLabel: "add_address", removeLabel: "remove_address") }

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
      expect(config[:translations][:en]).to include(basic_info: "Basic Information", professional_info: "Professional Information")
    end

    it "includes button translations" do
      expect(config[:translations][:en]).to include(save: "Save", saving: "Saving...")
    end

    it "includes spouse relationship translations" do
      expect(config[:translations][:en]).to include(spouse: "Spouse")
    end

    it "includes addresses relationship translations" do
      expect(config[:translations][:en]).to include(addresses: "Addresses", add_address: "Add Address", remove_address: "Remove")
    end

    it "includes address field translations" do
      expect(config[:translations][:en]).to include(
        label: "Label",
        address_line_1: "Address Line 1",
        city: "City",
        postal_code: "Postal Code",
        country: "Country"
      )
    end

    it "includes french relationship translations" do
      expect(config[:translations][:fr]).to include(
        spouse: "Conjoint(e)",
        addresses: "Adresses",
        add_address: "Ajouter une adresse",
        remove_address: "Supprimer"
      )
    end
  end
end
