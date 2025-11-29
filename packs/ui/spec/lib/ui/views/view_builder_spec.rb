# frozen_string_literal: true

require "rails_helper"

RSpec.describe Ui::Views::ViewBuilder do
  let(:builder) { described_class.new }

  describe "#field" do
    it "creates component element" do
      builder.field :name, kind: "INPUT_TEXT", placeholder: "Enter name"

      expect(builder.elements.length).to eq(1)
      expect(builder.elements[0][:type]).to eq("COMPONENT")
      expect(builder.elements[0][:name]).to eq("name")
      expect(builder.elements[0][:kind]).to eq("INPUT_TEXT")
      expect(builder.elements[0][:placeholder]).to eq("Enter name")
    end
  end

  describe "#group" do
    it "creates layout with nested elements" do
      builder.group label: "Personal Info" do
        field :first_name, kind: "INPUT_TEXT"
        field :last_name, kind: "INPUT_TEXT"
      end

      expect(builder.elements.length).to eq(1)
      expect(builder.elements[0][:type]).to eq("GROUP")
      expect(builder.elements[0][:label]).to eq("Personal Info")
      expect(builder.elements[0][:elements].length).to eq(2)
    end
  end

  describe "#card_group" do
    it "creates card layout" do
      builder.card_group label: "Settings" do
        field :published, kind: "INPUT_CHECKBOX"
      end

      expect(builder.elements[0][:type]).to eq("CARD_GROUP")
      expect(builder.elements[0][:label]).to eq("Settings")
    end
  end

  describe "#multistep" do
    it "creates multistep layout with steps" do
      builder.multistep do
        step label: "Step 1" do
          field :name, kind: "INPUT_TEXT"
        end
        step label: "Step 2" do
          field :description, kind: "INPUT_TEXTAREA"
        end
      end

      expect(builder.elements[0][:type]).to eq("MULTISTEP")
      expect(builder.elements[0][:elements].length).to eq(2)
      expect(builder.elements[0][:elements][0][:type]).to eq("STEP")
    end
  end

  describe "#submit" do
    it "creates submit button" do
      builder.submit label: "Create", loadingLabel: "Creating..."

      expect(builder.elements[0][:type]).to eq("SUBMIT")
      expect(builder.elements[0][:label]).to eq("Create")
      expect(builder.elements[0][:loadingLabel]).to eq("Creating...")
    end
  end

  describe "#form_array" do
    it "creates repeatable fields" do
      builder.form_array :tags, label: "Tags" do
        field :name, kind: "INPUT_TEXT"
      end

      expect(builder.elements[0][:type]).to eq("FORM_ARRAY")
      expect(builder.elements[0][:name]).to eq("tags")
      expect(builder.elements[0][:template].length).to eq(1)
    end

    it "supports add/remove labels" do
      builder.form_array :addresses, label: "addresses", add_label: "add_address", remove_label: "remove_address" do
        field :city, kind: "INPUT_TEXT"
      end

      expect(builder.elements[0][:addLabel]).to eq("add_address")
      expect(builder.elements[0][:removeLabel]).to eq("remove_address")
    end
  end

  describe "#table" do
    it "creates table with columns" do
      builder.table do |t|
        t.column :id, kind: "DISPLAY_NUMBER", label: "ID"
        t.column :name, kind: "DISPLAY_TEXT", label: "Name"
      end

      expect(builder.elements[0][:type]).to eq("TABLE")
      expect(builder.elements[0][:columns].length).to eq(2)
    end

    it "supports row actions" do
      builder.table do |t|
        t.column :name, kind: "DISPLAY_TEXT", label: "Name"
        t.row_click opens: :view_drawer
        t.row_actions icon: "ellipsis" do
          link :edit, opens: :edit_drawer
          link :delete, api: :destroy
        end
      end

      table = builder.elements[0]
      expect(table[:rowClick][:opens]).to eq("view_drawer")
      expect(table[:rowActions][:elements].length).to eq(2)
    end

    it "supports bulk actions" do
      builder.table do |t|
        t.column :name, kind: "DISPLAY_TEXT", label: "Name"
        t.bulk_actions do
          link :bulk_delete, api: :bulk_destroy
        end
      end

      table = builder.elements[0]
      expect(table[:bulkActions][:elements].length).to eq(1)
    end
  end

  describe "#page" do
    it "creates page with title and body" do
      builder.page do |c|
        c.title "page_title"
        c.description "page_description"
        c.actions do
          link "new_item", opens: :new_drawer
        end
        c.body do
          table do |t|
            t.column :name, kind: "DISPLAY_TEXT", label: "Name"
          end
        end
      end

      page = builder.elements[0]
      expect(page[:type]).to eq("PAGE")
      expect(page[:title]).to eq("page_title")
      expect(page[:description]).to eq("page_description")
      expect(page[:actions]).to be_present
    end
  end

  describe "#relationship_picker" do
    it "creates relationship picker element" do
      builder.relationship_picker :children, cardinality: :many, relation_schema: "contact" do |r|
        r.display do
          render :first_name, kind: "DISPLAY_TEXT"
        end

        r.form do
          field :first_name, kind: "INPUT_TEXT", label: "first_name"
        end
      end

      picker = builder.elements[0]
      expect(picker[:type]).to eq("RELATIONSHIP_PICKER")
      expect(picker[:name]).to eq("children_attributes")
      expect(picker[:cardinality]).to eq(:many)
      expect(picker[:relationSchema]).to eq("contact")
      expect(picker[:columns]).to be_an(Array)
      expect(picker[:template]).to be_an(Array)
    end
  end

  describe "#to_ui_schema" do
    it "returns VIEW type schema" do
      builder.field :title, kind: "INPUT_TEXT"
      schema = builder.to_ui_schema

      expect(schema[:type]).to eq("VIEW")
      expect(schema[:elements].length).to eq(1)
    end
  end

  describe "nested elements" do
    it "builds correctly" do
      builder.group label: "Outer" do
        group label: "Inner" do
          field :nested_field, kind: "INPUT_TEXT"
        end
      end

      outer = builder.elements[0]
      expect(outer[:type]).to eq("GROUP")
      expect(outer[:elements][0][:type]).to eq("GROUP")
      expect(outer[:elements][0][:elements][0][:name]).to eq("nested_field")
    end
  end
end
