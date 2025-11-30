# frozen_string_literal: true

require "rails_helper"

RSpec.describe Ui::Views::ViewBuilder do
  subject(:builder) { described_class.new }

  describe "#field" do
    it "creates field element with type" do
      builder.field :name, type: "INPUT_TEXT", placeholder: "Enter name"

      expect(builder.elements).to contain_exactly(
        a_hash_including(type: "INPUT_TEXT", name: "name", placeholder: "Enter name")
      )
    end
  end

  describe "#group" do
    it "creates layout with nested elements" do
      builder.group label: "Personal Info" do
        field :first_name, type: "INPUT_TEXT"
        field :last_name, type: "INPUT_TEXT"
      end

      expect(builder.elements).to contain_exactly(
        a_hash_including(
          type: "GROUP",
          label: "Personal Info",
          elements: have_attributes(length: 2)
        )
      )
    end
  end

  describe "#card_group" do
    it "creates card layout" do
      builder.card_group label: "Settings" do
        field :published, type: "INPUT_CHECKBOX"
      end

      expect(builder.elements.first).to include(type: "CARD_GROUP", label: "Settings")
    end
  end

  describe "#multistep" do
    it "creates multistep layout with steps" do
      builder.multistep do
        step label: "Step 1" do
          field :name, type: "INPUT_TEXT"
        end
        step label: "Step 2" do
          field :description, type: "INPUT_TEXTAREA"
        end
      end

      multistep = builder.elements.first
      expect(multistep).to include(type: "MULTISTEP")
      expect(multistep[:elements]).to have_attributes(length: 2)
      expect(multistep[:elements]).to all(include(type: "STEP"))
    end
  end

  describe "#submit" do
    it "creates submit button" do
      builder.submit label: "Create", loadingLabel: "Creating..."

      expect(builder.elements.first).to include(type: "SUBMIT", label: "Create", loadingLabel: "Creating...")
    end
  end

  describe "#form_array" do
    it "creates repeatable fields" do
      builder.form_array :tags, label: "Tags" do
        field :name, type: "INPUT_TEXT"
      end

      expect(builder.elements.first).to include(
        type: "FORM_ARRAY",
        name: "tags",
        template: have_attributes(length: 1)
      )
    end

    it "supports add/remove labels" do
      builder.form_array :addresses, label: "addresses", add_label: "add_address", remove_label: "remove_address" do
        field :city, type: "INPUT_TEXT"
      end

      expect(builder.elements.first).to include(addLabel: "add_address", removeLabel: "remove_address")
    end
  end

  describe "#table" do
    it "creates table with columns" do
      builder.table do |t|
        t.column :id, type: "DISPLAY_NUMBER", label: "ID"
        t.column :name, type: "DISPLAY_TEXT", label: "Name"
      end

      expect(builder.elements.first).to include(
        type: "TABLE",
        columns: have_attributes(length: 2)
      )
    end

    it "supports row actions" do
      builder.table do |t|
        t.column :name, type: "DISPLAY_TEXT", label: "Name"
        t.row_click opens: :view_drawer
        t.row_actions icon: "ellipsis" do
          link :edit, opens: :edit_drawer
          link :delete, api: :destroy
        end
      end

      table = builder.elements.first
      expect(table[:rowClick]).to include(opens: "view_drawer")
      expect(table[:rowActions][:elements]).to have_attributes(length: 2)
    end

    it "supports bulk actions" do
      builder.table do |t|
        t.column :name, type: "DISPLAY_TEXT", label: "Name"
        t.bulk_actions do
          link :bulk_delete, api: :bulk_destroy
        end
      end

      expect(builder.elements.first[:bulkActions][:elements]).to have_attributes(length: 1)
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
            t.column :name, type: "DISPLAY_TEXT", label: "Name"
          end
        end
      end

      page = builder.elements.first
      expect(page).to include(type: "PAGE", title: "page_title", description: "page_description")
      expect(page[:actions]).to be_present
    end
  end

  describe "#relationship" do
    let(:mock_schema) do
      Class.new do
        def self.relationships
          [
            { name: :spouse, cardinality: :one, target_schema: "contact" },
            { name: :addresses, cardinality: :many, target_schema: "address" }
          ]
        end
      end
    end

    let(:builder_with_schema) { described_class.new(schema_class: mock_schema) }

    describe "has_one relationship" do
      it "creates GROUP with prefixed fields" do
        builder_with_schema.relationship(:spouse, label: "spouse") do
          field :first_name, type: "INPUT_TEXT", label: "first_name"
          field :last_name, type: "INPUT_TEXT", label: "last_name"
        end

        group = builder_with_schema.elements.first
        expect(group).to include(type: "GROUP", name: "spouse_attributes", label: "spouse")
        expect(group[:elements]).to have_attributes(length: 2)
        expect(group[:elements]).to include(
          a_hash_including(name: "spouse_attributes.first_name"),
          a_hash_including(name: "spouse_attributes.last_name")
        )
      end
    end

    describe "has_many relationship" do
      it "creates FORM_ARRAY with template" do
        builder_with_schema.relationship(:addresses, label: "addresses", add_label: "add_address", remove_label: "remove") do
          field :city, type: "INPUT_TEXT", label: "city"
          field :country, type: "INPUT_TEXT", label: "country"
        end

        form_array = builder_with_schema.elements.first
        expect(form_array).to include(
          type: "FORM_ARRAY",
          name: "addresses_attributes",
          label: "addresses",
          addLabel: "add_address",
          removeLabel: "remove"
        )
        expect(form_array[:template]).to include(
          a_hash_including(name: "city"),
          a_hash_including(name: "country")
        )
      end
    end

    it "raises error without block" do
      expect {
        builder_with_schema.relationship(:spouse, label: "spouse")
      }.to raise_error(ArgumentError, /requires a block/)
    end

    it "raises error for unknown relationship" do
      expect {
        builder_with_schema.relationship(:unknown, label: "unknown") { field :name, type: "INPUT_TEXT" }
      }.to raise_error(ArgumentError, /not found in schema/)
    end

    it "raises error without schema" do
      expect {
        builder.relationship(:spouse, label: "spouse") { field :name, type: "INPUT_TEXT" }
      }.to raise_error(ArgumentError, /not found in schema/)
    end
  end

  describe "#relationship_picker" do
    it "creates relationship picker element" do
      builder.relationship_picker :children, cardinality: :many, relation_schema: "contact" do |r|
        r.display do
          render :first_name, type: "DISPLAY_TEXT"
        end

        r.form do
          field :first_name, type: "INPUT_TEXT", label: "first_name"
        end
      end

      picker = builder.elements.first
      expect(picker).to include(
        type: "RELATIONSHIP_PICKER",
        name: "children_attributes",
        cardinality: :many,
        relationSchema: "contact"
      )
      expect(picker[:columns]).to be_an(Array)
      expect(picker[:template]).to be_an(Array)
    end
  end

  describe "#to_ui_schema" do
    it "returns VIEW type schema" do
      builder.field :title, type: "INPUT_TEXT"

      expect(builder.to_ui_schema).to include(type: "VIEW")
      expect(builder.to_ui_schema[:elements]).to have_attributes(length: 1)
    end
  end

  describe "nested elements" do
    it "builds correctly" do
      builder.group label: "Outer" do
        group label: "Inner" do
          field :nested_field, type: "INPUT_TEXT"
        end
      end

      outer = builder.elements.first
      expect(outer).to include(type: "GROUP")
      expect(outer[:elements].first).to include(type: "GROUP")
      expect(outer[:elements].first[:elements].first).to include(name: "nested_field")
    end
  end
end
