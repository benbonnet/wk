# frozen_string_literal: true

require "rails_helper"

RSpec.describe Ui::Views::BaseView do
  describe "basic functionality" do
    let(:test_class) do
      Class.new do
        include Ui::Views::BaseView

        view do
          field :name, type: "INPUT_TEXT", placeholder: "Enter name"
          field :description, type: "INPUT_TEXTAREA"
        end
      end
    end

    it "returns view config without url or api" do
      config = test_class.view_config_raw
      expect(config).to include(type: "VIEW")
      expect(config).not_to have_key(:url)
      expect(config).not_to have_key(:api)
      expect(config[:elements]).to have_attributes(length: 2)
    end

    it { expect(test_class.has_view?).to be true }

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
            field :first_name, type: "INPUT_TEXT"
            field :last_name, type: "INPUT_TEXT"
          end
        end
      end
    end

    it "creates nested group structure" do
      config = grouped_class.view_config_raw
      expect(config[:elements]).to contain_exactly(
        a_hash_including(
          type: "GROUP",
          label: "Personal Info",
          elements: have_attributes(length: 2)
        )
      )
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
                t.column :name, type: "DISPLAY_TEXT", label: "name"
                t.column :email, type: "DISPLAY_TEXT", label: "email"
              end
            end
          end
        end
      end
    end

    it "creates page with table" do
      expect(page_class.view_config_raw[:elements]).to include(
        a_hash_including(type: "PAGE", title: "page_title")
      )
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
      expect(translated_class.view_config_raw[:translations]).to include(
        en: a_hash_including(page_title: "Test Page"),
        fr: a_hash_including(page_title: "Page Test")
      )
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
      config = drawer_class.view_config_raw
      expect(config[:drawers]).to be_a(Hash)
      expect(config[:drawers]).to have_key(:new_drawer)
    end
  end
end
