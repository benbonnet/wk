# frozen_string_literal: true

require "rails_helper"

RSpec.describe ContactsService::Views::Index do
  let(:config) { described_class.view_config }

  describe "structure" do
    it "has type VIEW" do
      expect(config[:type]).to eq("VIEW")
    end

    it "has page element" do
      page = config[:elements]&.find { |e| e[:type] == "PAGE" }
      expect(page).to be_present
      expect(page[:title]).to eq("page_title")
    end

    it "has table element in page" do
      page = config[:elements]&.find { |e| e[:type] == "PAGE" }
      group = page[:elements]&.find { |e| e[:type] == "GROUP" }
      table = group[:elements]&.find { |e| e[:type] == "TABLE" }
      expect(table).to be_present
    end

    it "has selectable table" do
      page = config[:elements]&.find { |e| e[:type] == "PAGE" }
      group = page[:elements]&.find { |e| e[:type] == "GROUP" }
      table = group[:elements]&.find { |e| e[:type] == "TABLE" }
      expect(table[:selectable]).to be true
    end

    it "has table columns matching schema fields" do
      page = config[:elements]&.find { |e| e[:type] == "PAGE" }
      group = page[:elements]&.find { |e| e[:type] == "GROUP" }
      table = group[:elements]&.find { |e| e[:type] == "TABLE" }

      column_names = table[:columns].map { |c| c[:name].to_sym }
      expect(column_names).to include(:first_name, :last_name, :email, :phone)
    end
  end

  describe "drawers" do
    it "has drawers registry" do
      expect(config[:drawers]).to be_a(Hash)
    end

    it "has new_drawer" do
      expect(config[:drawers]).to have_key(:new_drawer)
    end

    it "has edit_drawer" do
      expect(config[:drawers]).to have_key(:edit_drawer)
    end

    it "has view_drawer" do
      expect(config[:drawers]).to have_key(:view_drawer)
    end
  end

  describe "translations" do
    it "has english translations" do
      expect(config[:translations][:en]).to be_present
    end

    it "has french translations" do
      expect(config[:translations][:fr]).to be_present
    end

    it "includes page_title translation" do
      expect(config[:translations][:en][:page_title]).to eq("Contacts")
    end

    it "includes action translations" do
      en = config[:translations][:en]
      expect(en[:new_contact]).to be_present
      expect(en[:edit]).to be_present
      expect(en[:delete]).to be_present
    end

    it "includes notification translations" do
      en = config[:translations][:en]
      expect(en[:contact_created]).to be_present
      expect(en[:contact_deleted]).to be_present
      expect(en[:contact_create_failed]).to be_present
    end
  end

  describe "row actions" do
    let(:table) do
      page = config[:elements]&.find { |e| e[:type] == "PAGE" }
      group = page[:elements]&.find { |e| e[:type] == "GROUP" }
      group[:elements]&.find { |e| e[:type] == "TABLE" }
    end

    it "has row_click opening view_drawer" do
      expect(table[:rowClick]).to be_present
      expect(table[:rowClick][:opens]).to eq("view_drawer")
    end

    it "has row actions with edit and delete" do
      actions = table[:rowActions][:elements]
      labels = actions.map { |a| a[:label].to_s }
      expect(labels).to include("edit", "delete")
    end

    it "delete action has confirmation" do
      actions = table[:rowActions][:elements]
      delete_action = actions.find { |a| a[:label].to_s == "delete" }
      expect(delete_action[:confirm]).to eq("delete_confirm")
    end
  end

  describe "bulk actions" do
    let(:table) do
      page = config[:elements]&.find { |e| e[:type] == "PAGE" }
      group = page[:elements]&.find { |e| e[:type] == "GROUP" }
      group[:elements]&.find { |e| e[:type] == "TABLE" }
    end

    it "has bulk actions" do
      expect(table[:bulkActions]).to be_present
    end

    it "includes bulk_delete action" do
      actions = table[:bulkActions][:elements]
      labels = actions.map { |a| a[:label].to_s }
      expect(labels).to include("bulk_delete")
    end
  end
end
