# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Schema::Translations do
  let(:schema_class) do
    Class.new(Core::Schema::Base) do
      translations(
        en: { first_name: "First Name", last_name: "Last Name" },
        fr: { first_name: "Prénom", last_name: "Nom" }
      )
    end
  end

  describe ".translations" do
    it "returns stored translations" do
      expect(schema_class.translations[:en]).to include(first_name: "First Name")
      expect(schema_class.translations[:fr]).to include(first_name: "Prénom")
    end

    it "returns empty hash when no translations defined" do
      empty_class = Class.new(Core::Schema::Base)
      expect(empty_class.translations).to eq({})
    end
  end

  describe ".t" do
    it { expect(schema_class.t(:first_name, locale: :en)).to eq("First Name") }
    it { expect(schema_class.t(:first_name, locale: :fr)).to eq("Prénom") }
    it { expect(schema_class.t(:first_name)).to eq("First Name") }
    it { expect(schema_class.t(:unknown_key)).to eq("Unknown key") }
  end

  describe ".translation_keys" do
    it { expect(schema_class.translation_keys).to contain_exactly(:first_name, :last_name) }
  end
end
