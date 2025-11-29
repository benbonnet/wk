# frozen_string_literal: true

require "rails_helper"

RSpec.describe Ui::Views::BaseView do
  describe "basic functionality" do
    let(:test_class) do
      Class.new do
        include Ui::Views::BaseView

        view do
          field :name, kind: "INPUT_TEXT", placeholder: "Enter name"
          field :description, kind: "INPUT_TEXTAREA"
        end
      end
    end

    it "returns view config" do
      config = test_class.view_config
      expect(config[:type]).to eq("VIEW")
      expect(config[:elements].length).to eq(2)
    end

    it "has_view? returns true when view defined" do
      expect(test_class.has_view?).to be true
    end

    it "has_view? returns false when no view defined" do
      empty_class = Class.new { include Ui::Views::BaseView }
      expect(empty_class.has_view?).to be false
    end
  end

  describe "nested groups" do
    let(:grouped_class) do
      Class.new do
        include Ui::Views::BaseView

        view do
          group label: "Personal Info" do
            field :first_name, kind: "INPUT_TEXT"
            field :last_name, kind: "INPUT_TEXT"
          end
        end
      end
    end

    it "creates nested group structure" do
      config = grouped_class.view_config
      expect(config[:elements].length).to eq(1)
      expect(config[:elements][0][:type]).to eq("GROUP")
      expect(config[:elements][0][:label]).to eq("Personal Info")
      expect(config[:elements][0][:elements].length).to eq(2)
    end
  end

  describe "page with table" do
    let(:page_class) do
      Class.new do
        include Ui::Views::BaseView

        view do
          page do |c|
            c.title "page_title"
            c.body do
              table do |t|
                t.column :name, kind: "DISPLAY_TEXT", label: "name"
                t.column :email, kind: "DISPLAY_TEXT", label: "email"
              end
            end
          end
        end
      end
    end

    it "creates page with table" do
      config = page_class.view_config
      page = config[:elements].find { |e| e[:type] == "PAGE" }
      expect(page).to be_present
      expect(page[:title]).to eq("page_title")
    end
  end

  describe "translations" do
    let(:translated_class) do
      Class.new do
        include Ui::Views::BaseView

        view do
          translations(
            en: { page_title: "Test Page", save: "Save" },
            fr: { page_title: "Page Test", save: "Sauvegarder" }
          )

          page do |c|
            c.title "page_title"
          end
        end
      end
    end

    it "includes translations in config" do
      config = translated_class.view_config
      expect(config[:translations][:en][:page_title]).to eq("Test Page")
      expect(config[:translations][:fr][:page_title]).to eq("Page Test")
    end
  end

  describe "drawers" do
    let(:drawer_class) do
      Class.new do
        include Ui::Views::BaseView

        view do
          drawers do |d|
            d.drawer(:new_drawer, className: "w-1/2") do |drawer|
              drawer.title "new_item"
            end
          end

          page do |c|
            c.title "page_title"
          end
        end
      end
    end

    it "creates drawers registry" do
      config = drawer_class.view_config
      expect(config[:drawers]).to be_a(Hash)
      expect(config[:drawers]).to have_key(:new_drawer)
    end
  end
end
