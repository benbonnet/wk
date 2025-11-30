# frozen_string_literal: true

require "rails_helper"

RSpec.describe ContactsService::Views::Index do
  subject(:config) { described_class.view_config_raw }

  let(:page) { config[:elements]&.find { |e| e[:type] == "PAGE" } }
  let(:group) { page[:elements]&.find { |e| e[:type] == "GROUP" } }
  let(:table) { group[:elements]&.find { |e| e[:type] == "TABLE" } }

  describe "structure" do
    it { expect(config).to include(type: "VIEW") }

    it "has page element" do
      expect(config[:elements]).to include(a_hash_including(type: "PAGE", title: "page_title"))
    end

    it { expect(table).to be_present }
    it { expect(table).to include(selectable: true) }

    it "has table columns matching schema fields" do
      column_names = table[:columns].map { |c| c[:name].to_sym }
      expect(column_names).to include(:first_name, :last_name, :email, :phone)
    end
  end

  describe "drawers" do
    it { expect(config[:drawers]).to be_a(Hash) }
    it { expect(config[:drawers]).to have_key(:new_drawer) }
    it { expect(config[:drawers]).to have_key(:edit_drawer) }
    it { expect(config[:drawers]).to have_key(:view_drawer) }
  end

  describe "translations" do
    it { expect(config[:translations]).to have_key(:en) }
    it { expect(config[:translations]).to have_key(:fr) }
    it { expect(config[:translations][:en]).to include(page_title: "Contacts") }

    it "includes action translations" do
      expect(config[:translations][:en]).to include(:new_contact, :edit, :delete)
    end

    it "includes notification translations" do
      expect(config[:translations][:en]).to include(:contact_created, :contact_deleted, :contact_create_failed)
    end
  end

  describe "row actions" do
    it { expect(table[:rowClick]).to include(opens: "view_drawer") }

    it "has row actions with edit and delete" do
      expect(table[:rowActions][:elements]).to include(
        a_hash_including(label: "edit"),
        a_hash_including(label: "delete")
      )
    end

    it "delete action has confirmation" do
      expect(table[:rowActions][:elements]).to include(
        a_hash_including(label: "delete", confirm: "delete_confirm")
      )
    end
  end

  describe "bulk actions" do
    it { expect(table[:bulkActions]).to be_present }

    it "includes bulk_delete action" do
      expect(table[:bulkActions][:elements]).to include(a_hash_including(label: "bulk_delete"))
    end
  end
end
