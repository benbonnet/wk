# frozen_string_literal: true

require "rails_helper"

RSpec.describe ContactsService::Views::Form do
  let(:config) { described_class.view_config }

  describe "structure" do
    it "has type VIEW" do
      expect(config[:type]).to eq("VIEW")
    end

    it "has form element" do
      form = config[:elements]&.find { |e| e[:type] == "FORM" }
      expect(form).to be_present
    end
  end

  describe "form groups" do
    let(:form) { config[:elements]&.find { |e| e[:type] == "FORM" } }
    let(:wrapper) { form[:elements]&.first }

    it "has basic_info group" do
      basic_info = wrapper[:elements]&.find { |e| e[:type] == "GROUP" && e[:label] == "basic_info" }
      expect(basic_info).to be_present
    end

    it "has professional_info group" do
      professional = wrapper[:elements]&.find { |e| e[:type] == "GROUP" && e[:label] == "professional_info" }
      expect(professional).to be_present
    end

    it "has personal_info group" do
      personal = wrapper[:elements]&.find { |e| e[:type] == "GROUP" && e[:label] == "personal_info" }
      expect(personal).to be_present
    end
  end

  describe "form fields" do
    let(:form) { config[:elements]&.find { |e| e[:type] == "FORM" } }
    let(:wrapper) { form[:elements]&.first }
    let(:basic_info) { wrapper[:elements]&.find { |e| e[:type] == "GROUP" && e[:label] == "basic_info" } }

    it "has first_name field" do
      field = basic_info[:elements]&.find { |e| e[:name] == "first_name" }
      expect(field).to be_present
      expect(field[:kind]).to eq("INPUT_TEXT")
    end

    it "has last_name field" do
      field = basic_info[:elements]&.find { |e| e[:name] == "last_name" }
      expect(field).to be_present
      expect(field[:kind]).to eq("INPUT_TEXT")
    end

    it "has email field" do
      field = basic_info[:elements]&.find { |e| e[:name] == "email" }
      expect(field).to be_present
    end
  end

  describe "relationship picker" do
    let(:form) { config[:elements]&.find { |e| e[:type] == "FORM" } }
    let(:wrapper) { form[:elements]&.first }

    it "has children relationship picker" do
      picker = wrapper[:elements]&.find { |e| e[:type] == "RELATIONSHIP_PICKER" && e[:name] == "children_attributes" }
      expect(picker).to be_present
      expect(picker[:cardinality]).to eq(:many)
      expect(picker[:relationSchema]).to eq("contact")
    end

    it "relationship picker has template fields" do
      picker = wrapper[:elements]&.find { |e| e[:type] == "RELATIONSHIP_PICKER" && e[:name] == "children_attributes" }
      field_names = picker[:template].map { |f| f[:name] }
      expect(field_names).to include("first_name", "last_name")
    end
  end

  describe "submit button" do
    let(:form) { config[:elements]&.find { |e| e[:type] == "FORM" } }

    it "has submit button" do
      footer = form[:elements]&.last
      submit = footer[:elements]&.find { |e| e[:type] == "SUBMIT" }
      expect(submit).to be_present
      expect(submit[:label]).to eq("save")
    end

    it "has loading label" do
      footer = form[:elements]&.last
      submit = footer[:elements]&.find { |e| e[:type] == "SUBMIT" }
      expect(submit[:loadingLabel]).to eq("saving")
    end
  end

  describe "translations" do
    it "has english translations" do
      expect(config[:translations][:en]).to be_present
    end

    it "has french translations" do
      expect(config[:translations][:fr]).to be_present
    end

    it "includes group label translations" do
      en = config[:translations][:en]
      expect(en[:basic_info]).to eq("Basic Information")
      expect(en[:professional_info]).to eq("Professional Information")
    end

    it "includes button translations" do
      en = config[:translations][:en]
      expect(en[:save]).to eq("Save")
      expect(en[:saving]).to eq("Saving...")
    end
  end
end
