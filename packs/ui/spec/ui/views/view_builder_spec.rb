# frozen_string_literal: true

require "spec_helper"
require_relative "../../../lib/ui"

RSpec.describe UI::Views::ViewBuilder do
  subject(:builder) { described_class.new }

  describe "#to_ui_schema" do
    it "returns VIEW type by default" do
      expect(builder.to_ui_schema).to eq({ type: "VIEW", elements: [] })
    end
  end

  describe "#translations" do
    it "includes translations in output" do
      builder.translations(
        en: { views: { title: "Hello" } },
        fr: { views: { title: "Bonjour" } }
      )

      schema = builder.to_ui_schema

      expect(schema[:translations]).to eq({
        en: { views: { title: "Hello" } },
        fr: { views: { title: "Bonjour" } }
      })
    end
  end

  describe "#api" do
    it "defines API endpoints" do
      builder.api do |a|
        a.index method: :get, path: ""
        a.create method: :post, path: ""
        a.show method: :get, path: ":id"
        a.update method: :patch, path: ":id"
        a.destroy method: :delete, path: ":id"
      end

      schema = builder.to_ui_schema

      expect(schema[:api]).to eq({
        index: { method: "GET", path: "" },
        create: { method: "POST", path: "" },
        show: { method: "GET", path: ":id" },
        update: { method: "PATCH", path: ":id" },
        destroy: { method: "DELETE", path: ":id" }
      })
    end
  end

  describe "#drawers" do
    it "defines drawers with title and body" do
      builder.drawers do |d|
        d.drawer(:new_item) do |drawer|
          drawer.title "New Item"
          drawer.description "Create a new item"
          drawer.body do
            field :name, kind: "INPUT_TEXT"
          end
        end
      end

      schema = builder.to_ui_schema

      expect(schema[:drawers][:new_item]).to include(
        title: "New Item",
        description: "Create a new item"
      )
      expect(schema[:drawers][:new_item][:elements]).to eq([
        { type: "COMPONENT", name: "name", kind: "INPUT_TEXT" }
      ])
    end
  end

  describe "#page" do
    it "creates PAGE element with title and actions" do
      builder.page do |p|
        p.title "My Page"
        p.description "Page description"
        p.actions do
          link "Add", opens: :new_drawer, variant: "primary"
        end
        p.body do
          group "Details" do
            field :name, kind: "DISPLAY_TEXT"
          end
        end
      end

      schema = builder.to_ui_schema
      page = schema[:elements].first

      expect(page[:type]).to eq("PAGE")
      expect(page[:title]).to eq("My Page")
      expect(page[:description]).to eq("Page description")
      expect(page[:actions]).to eq([
        { type: "LINK", label: "Add", opens: "new_drawer", variant: "primary" }
      ])
      expect(page[:elements].first[:type]).to eq("GROUP")
    end
  end

  describe "#form" do
    it "creates FORM element with fields" do
      builder.form action: :create do
        field :first_name, kind: "INPUT_TEXT", placeholder: "Enter first name"
        field :last_name, kind: "INPUT_TEXT"
        submit "Save"
      end

      schema = builder.to_ui_schema
      form = schema[:elements].first

      expect(form[:type]).to eq("FORM")
      expect(form[:action]).to eq(:create)
      expect(form[:elements]).to eq([
        { type: "COMPONENT", name: "first_name", kind: "INPUT_TEXT", placeholder: "Enter first name" },
        { type: "COMPONENT", name: "last_name", kind: "INPUT_TEXT" },
        { type: "SUBMIT", label: "Save" }
      ])
    end
  end

  describe "#table" do
    it "creates TABLE element with columns and row actions" do
      builder.table searchable: true, selectable: true do |t|
        t.column :name, kind: "DISPLAY_TEXT", label: "Name", sortable: true
        t.column :email, kind: "DISPLAY_TEXT", label: "Email"
        t.column :status, kind: "DISPLAY_BADGE", label: "Status"
        t.row_click opens: :view_drawer
        t.row_actions icon: "more" do |a|
          a.action "Edit", opens: :edit_drawer, icon: "edit"
          a.action "Delete", api: :destroy, confirm: "Are you sure?", variant: "destructive"
        end
        t.bulk_actions do |a|
          a.action "Delete Selected", api: :bulk_destroy, confirm: "Delete all selected?"
        end
      end

      schema = builder.to_ui_schema
      table = schema[:elements].first

      expect(table[:type]).to eq("TABLE")
      expect(table[:searchable]).to be true
      expect(table[:selectable]).to be true
      expect(table[:columns]).to eq([
        { name: "name", kind: "DISPLAY_TEXT", label: "Name", sortable: true },
        { name: "email", kind: "DISPLAY_TEXT", label: "Email" },
        { name: "status", kind: "DISPLAY_BADGE", label: "Status" }
      ])
      expect(table[:rowClick]).to eq({ opens: "view_drawer" })
      expect(table[:rowActions][:icon]).to eq("more")
      expect(table[:rowActions][:elements]).to include(
        { type: "OPTION", label: "Edit", opens: "edit_drawer", icon: "edit" }
      )
      expect(table[:bulkActions][:elements]).to include(
        { type: "OPTION", label: "Delete Selected", api: "bulk_destroy", confirm: "Delete all selected?" }
      )
    end

    it "supports row_click with href" do
      builder.table do |t|
        t.column :name, kind: "DISPLAY_TEXT"
        t.row_click href: "/items/:id"
      end

      schema = builder.to_ui_schema
      table = schema[:elements].first

      expect(table[:rowHref]).to eq("/items/:id")
      expect(table[:rowClick]).to be_nil
    end
  end

  describe "#show" do
    it "creates SHOW element with display fields" do
      builder.show do
        group "Basic Info" do
          render :name, kind: "DISPLAY_TEXT"
          render :email, kind: "DISPLAY_TEXT"
        end
        group "Status" do
          render :status, kind: "DISPLAY_BADGE"
        end
      end

      schema = builder.to_ui_schema
      show = schema[:elements].first

      expect(show[:type]).to eq("SHOW")
      expect(show[:elements].length).to eq(2)
      expect(show[:elements].first[:type]).to eq("GROUP")
    end
  end

  describe "#group and #card_group" do
    it "creates GROUP element" do
      builder.group "Section" do
        field :name, kind: "INPUT_TEXT"
      end

      schema = builder.to_ui_schema
      group = schema[:elements].first

      expect(group[:type]).to eq("GROUP")
      expect(group[:label]).to eq("Section")
    end

    it "creates CARD_GROUP element" do
      builder.card_group "Card Section" do
        field :name, kind: "INPUT_TEXT"
      end

      schema = builder.to_ui_schema
      card = schema[:elements].first

      expect(card[:type]).to eq("CARD_GROUP")
      expect(card[:label]).to eq("Card Section")
    end
  end

  describe "#multistep and #step" do
    it "creates MULTISTEP with STEP elements" do
      builder.multistep do
        step "Step 1" do
          field :name, kind: "INPUT_TEXT"
        end
        step "Step 2" do
          field :email, kind: "INPUT_TEXT"
        end
      end

      schema = builder.to_ui_schema
      multistep = schema[:elements].first

      expect(multistep[:type]).to eq("MULTISTEP")
      expect(multistep[:elements].length).to eq(2)
      expect(multistep[:elements].first[:type]).to eq("STEP")
      expect(multistep[:elements].first[:label]).to eq("Step 1")
    end
  end

  describe "#form_array" do
    it "creates FORM_ARRAY with template" do
      builder.form_array :items, addLabel: "Add Item", removeLabel: "Remove" do
        field :name, kind: "INPUT_TEXT"
        field :quantity, kind: "INPUT_TEXT"
      end

      schema = builder.to_ui_schema
      arr = schema[:elements].first

      expect(arr[:type]).to eq("FORM_ARRAY")
      expect(arr[:name]).to eq("items")
      expect(arr[:addLabel]).to eq("Add Item")
      expect(arr[:template]).to eq([
        { type: "COMPONENT", name: "name", kind: "INPUT_TEXT" },
        { type: "COMPONENT", name: "quantity", kind: "INPUT_TEXT" }
      ])
    end
  end

  describe "#display_array" do
    it "creates DISPLAY_ARRAY with template" do
      builder.display_array :items do
        render :name, kind: "DISPLAY_TEXT"
      end

      schema = builder.to_ui_schema
      arr = schema[:elements].first

      expect(arr[:type]).to eq("DISPLAY_ARRAY")
      expect(arr[:name]).to eq("items")
      expect(arr[:template]).to eq([
        { type: "COMPONENT", name: "name", kind: "DISPLAY_TEXT" }
      ])
    end
  end

  describe "#relationship_picker" do
    it "creates RELATIONSHIP_PICKER element" do
      builder.relationship_picker :contacts, cardinality: :many, relation_schema: "contact" do |r|
        r.column :name, kind: "DISPLAY_TEXT", label: "Name"
        r.column :email, kind: "DISPLAY_TEXT", label: "Email"
        r.form do
          field :role, kind: "INPUT_SELECT"
        end
      end

      schema = builder.to_ui_schema
      picker = schema[:elements].first

      expect(picker[:type]).to eq("RELATIONSHIP_PICKER")
      expect(picker[:name]).to eq("contacts_attributes")
      expect(picker[:cardinality]).to eq(:many)
      expect(picker[:relationSchema]).to eq("contact")
      expect(picker[:columns]).to eq([
        { name: "name", kind: "DISPLAY_TEXT", label: "Name" },
        { name: "email", kind: "DISPLAY_TEXT", label: "Email" }
      ])
      expect(picker[:template]).to eq([
        { type: "COMPONENT", name: "role", kind: "INPUT_SELECT" }
      ])
    end
  end

  describe "#alert" do
    it "creates ALERT element" do
      builder.alert "Warning message", color: "yellow"

      schema = builder.to_ui_schema
      alert = schema[:elements].first

      expect(alert[:type]).to eq("ALERT")
      expect(alert[:label]).to eq("Warning message")
      expect(alert[:color]).to eq("yellow")
    end
  end

  describe "#link" do
    it "creates LINK element with href" do
      builder.link "Go Home", href: "/home", variant: "secondary"

      schema = builder.to_ui_schema
      link = schema[:elements].first

      expect(link[:type]).to eq("LINK")
      expect(link[:label]).to eq("Go Home")
      expect(link[:href]).to eq("/home")
      expect(link[:variant]).to eq("secondary")
    end

    it "creates LINK element with opens" do
      builder.link "New", opens: :new_drawer, variant: "primary"

      schema = builder.to_ui_schema
      link = schema[:elements].first

      expect(link[:opens]).to eq("new_drawer")
    end

    it "creates LINK element with api and notification" do
      builder.link "Delete", api: :destroy, confirm: "Sure?", notification: { success: "Deleted!", error: "Failed" }

      schema = builder.to_ui_schema
      link = schema[:elements].first

      expect(link[:api]).to eq("destroy")
      expect(link[:confirm]).to eq("Sure?")
      expect(link[:notification]).to eq({ success: "Deleted!", error: "Failed" })
    end
  end

  describe "#button" do
    it "creates BUTTON element" do
      builder.button "Click Me", variant: "ghost", icon: "plus"

      schema = builder.to_ui_schema
      btn = schema[:elements].first

      expect(btn[:type]).to eq("BUTTON")
      expect(btn[:label]).to eq("Click Me")
      expect(btn[:variant]).to eq("ghost")
      expect(btn[:icon]).to eq("plus")
    end
  end

  describe "#dropdown" do
    it "creates DROPDOWN with OPTION elements" do
      builder.dropdown label: "Actions", icon: "menu" do
        option "Edit", opens: :edit_drawer
        option "Delete", api: :destroy, variant: "destructive"
      end

      schema = builder.to_ui_schema
      dropdown = schema[:elements].first

      expect(dropdown[:type]).to eq("DROPDOWN")
      expect(dropdown[:label]).to eq("Actions")
      expect(dropdown[:elements]).to eq([
        { type: "OPTION", label: "Edit", opens: :edit_drawer },
        { type: "OPTION", label: "Delete", api: :destroy, variant: "destructive" }
      ])
    end
  end

  describe "#search" do
    it "creates SEARCH element" do
      builder.search placeholder: "Search...", searchPlaceholder: "Type to search"

      schema = builder.to_ui_schema
      search = schema[:elements].first

      expect(search[:type]).to eq("SEARCH")
      expect(search[:placeholder]).to eq("Search...")
    end
  end

  describe "compact output" do
    it "excludes nil values from output" do
      builder.field :name, kind: "INPUT_TEXT"

      schema = builder.to_ui_schema
      field = schema[:elements].first

      expect(field.keys).to eq([:type, :name, :kind])
      expect(field).not_to have_key(:label)
      expect(field).not_to have_key(:placeholder)
    end
  end
end
