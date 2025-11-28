# frozen_string_literal: true

require "spec_helper"
require_relative "../../../lib/ui"

RSpec.describe UI::Views::BaseView do
  let(:view_class) do
    Class.new do
      include UI::Views::BaseView

      view do
        translations(
          en: {
            schemas: { contact: { first_name: "First Name" } },
            views: { page_title: "Contacts" },
            common: { save: "Save" }
          }
        )

        api do |a|
          a.index method: :get, path: ""
          a.create method: :post, path: ""
        end

        drawers do |d|
          d.drawer(:new_contact) do |drawer|
            drawer.title "new_contact"
            drawer.body do
              form action: :create do
                field :first_name, kind: "INPUT_TEXT"
                submit "save"
              end
            end
          end
        end

        page do |p|
          p.title "page_title"
          p.actions do
            link "new_contact", opens: :new_contact, variant: "primary"
          end
          p.body do
            table searchable: true do |t|
              t.column :first_name, kind: "DISPLAY_TEXT", label: "first_name"
              t.row_click opens: :view_contact
            end
          end
        end
      end
    end
  end

  describe ".view_config" do
    subject(:config) { view_class.view_config }

    it "returns VIEW type" do
      expect(config[:type]).to eq("VIEW")
    end

    it "includes translations" do
      expect(config[:translations][:en][:views][:page_title]).to eq("Contacts")
    end

    it "includes api registry" do
      expect(config[:api][:index]).to eq({ method: "GET", path: "" })
      expect(config[:api][:create]).to eq({ method: "POST", path: "" })
    end

    it "includes drawers" do
      expect(config[:drawers][:new_contact][:title]).to eq("new_contact")
      expect(config[:drawers][:new_contact][:elements].first[:type]).to eq("FORM")
    end

    it "includes page element" do
      page = config[:elements].first
      expect(page[:type]).to eq("PAGE")
      expect(page[:title]).to eq("page_title")
    end

    it "memoizes the config" do
      first_call = view_class.view_config
      second_call = view_class.view_config
      expect(first_call).to equal(second_call)
    end
  end

  describe "minimal view" do
    let(:minimal_view) do
      Class.new do
        include UI::Views::BaseView

        view do
          page do |p|
            p.title "Simple Page"
          end
        end
      end
    end

    it "works without translations, api, or drawers" do
      config = minimal_view.view_config

      expect(config[:type]).to eq("VIEW")
      expect(config[:translations]).to be_nil
      expect(config[:api]).to be_nil
      expect(config[:drawers]).to be_nil
      expect(config[:elements].first[:title]).to eq("Simple Page")
    end
  end
end
