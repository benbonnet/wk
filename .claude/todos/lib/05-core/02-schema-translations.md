# 02 - Schema Translations Module

## File: packs/core/app/lib/core/schema/translations.rb

```ruby
# frozen_string_literal: true

module Core
  module Schema
    module Translations
      extend ActiveSupport::Concern

      class_methods do
        def translations(data = nil)
          if data
            @translations = data
          end
          @translations || {}
        end

        def t(key, locale: :en)
          translations.dig(locale, key.to_sym) || key.to_s.humanize
        end

        def translation_keys
          translations.values.flat_map(&:keys).uniq
        end
      end
    end
  end
end
```

## Spec: packs/core/spec/lib/core/schema/translations_spec.rb

```ruby
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
      expect(schema_class.translations[:en][:first_name]).to eq("First Name")
      expect(schema_class.translations[:fr][:first_name]).to eq("Prénom")
    end

    it "returns empty hash when no translations defined" do
      empty_class = Class.new(Core::Schema::Base)
      expect(empty_class.translations).to eq({})
    end
  end

  describe ".t" do
    it "returns translation for given locale" do
      expect(schema_class.t(:first_name, locale: :en)).to eq("First Name")
      expect(schema_class.t(:first_name, locale: :fr)).to eq("Prénom")
    end

    it "defaults to :en locale" do
      expect(schema_class.t(:first_name)).to eq("First Name")
    end

    it "returns humanized key when translation missing" do
      expect(schema_class.t(:unknown_key)).to eq("Unknown key")
    end
  end

  describe ".translation_keys" do
    it "returns unique keys across all locales" do
      expect(schema_class.translation_keys).to contain_exactly(:first_name, :last_name)
    end
  end
end
```
