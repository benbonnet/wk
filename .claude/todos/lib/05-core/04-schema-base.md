# 04 - Schema Base Class

## File: packs/core/app/lib/core/schema/base.rb

```ruby
# frozen_string_literal: true

module Core
  module Schema
    class Base < RubyLLM::Schema
      include Translations
      include Relationships

      class << self
        def title(value = nil)
          @title = value if value
          @title || name&.demodulize&.sub(/Schema$/, "")
        end

        def slug(value = nil)
          @slug = value if value
          @slug || title&.underscore&.dasherize
        end

        # Common field helpers
        def timestamps
          string :created_at, format: "date-time", required: false
          string :updated_at, format: "date-time", required: false
        end

        def soft_delete
          string :deleted_at, format: "date-time", required: false
        end

        def slug_field(field_name = :slug, max_length: 255)
          string field_name, max_length: max_length, pattern: "^[a-z0-9-]+$"
        end

        def status_field(field_name = :status, values:)
          string field_name, enum: values
        end

        def metadata_field(field_name = :metadata)
          object field_name, required: false do
            additional_properties true
          end
        end

        # Full export including relationships and translations
        def to_full_schema
          {
            slug: slug,
            title: title,
            description: description,
            json_schema: to_json_schema,
            relationships: relationships,
            translations: translations
          }
        end

        # Export for frontend mocks
        def to_mock_data
          {
            slug: slug,
            title: title,
            schema: to_json_schema,
            relationships: relationships.map do |r|
              {
                name: r[:name],
                cardinality: r[:cardinality],
                targetSchema: r[:target_schema],
                inverseName: r[:inverse_name]
              }
            end,
            translations: translations
          }
        end
      end
    end
  end
end
```

## Spec: packs/core/spec/lib/core/schema/base_spec.rb

```ruby
# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Schema::Base do
  describe ".title" do
    it "allows setting custom title" do
      schema = Class.new(Core::Schema::Base) do
        title "Contact"
      end
      expect(schema.title).to eq("Contact")
    end

    it "infers title from class name" do
      schema = Class.new(Core::Schema::Base)
      allow(schema).to receive(:name).and_return("ContactsService::ContactSchema")
      expect(schema.title).to eq("Contact")
    end
  end

  describe ".slug" do
    it "allows setting custom slug" do
      schema = Class.new(Core::Schema::Base) do
        slug "my-contact"
      end
      expect(schema.slug).to eq("my-contact")
    end

    it "infers slug from title" do
      schema = Class.new(Core::Schema::Base) do
        title "Contact Person"
      end
      expect(schema.slug).to eq("contact-person")
    end
  end

  describe "field helpers" do
    let(:schema) do
      Class.new(Core::Schema::Base) do
        title "Test"
        timestamps
        soft_delete
        slug_field :identifier
        status_field :state, values: %w[draft active archived]
      end
    end

    it "adds timestamp fields" do
      props = schema.properties
      expect(props).to have_key(:created_at)
      expect(props).to have_key(:updated_at)
    end

    it "adds soft delete field" do
      expect(schema.properties).to have_key(:deleted_at)
    end

    it "adds slug field with pattern" do
      prop = schema.properties[:identifier]
      expect(prop[:pattern]).to eq("^[a-z0-9-]+$")
    end

    it "adds status field with enum" do
      prop = schema.properties[:state]
      expect(prop[:enum]).to eq(%w[draft active archived])
    end
  end

  describe ".to_full_schema" do
    let(:schema) do
      Class.new(Core::Schema::Base) do
        title "Contact"
        description "A contact"
        string :name

        relationships do
          has_many :addresses, schema: :address
        end

        translations(en: { name: "Name" })
      end
    end

    it "includes all schema components" do
      full = schema.to_full_schema
      expect(full[:slug]).to eq("contact")
      expect(full[:title]).to eq("Contact")
      expect(full[:description]).to eq("A contact")
      expect(full[:json_schema]).to be_a(Hash)
      expect(full[:relationships].length).to eq(1)
      expect(full[:translations][:en][:name]).to eq("Name")
    end
  end

  describe ".to_mock_data" do
    let(:schema) do
      Class.new(Core::Schema::Base) do
        title "Contact"
        string :name

        relationships do
          has_many :addresses, schema: :address, inverse: :contact
        end

        translations(en: { name: "Name" })
      end
    end

    it "formats relationships for frontend" do
      mock = schema.to_mock_data
      rel = mock[:relationships].first
      expect(rel[:name]).to eq(:addresses)
      expect(rel[:cardinality]).to eq(:many)
      expect(rel[:targetSchema]).to eq("address")
      expect(rel[:inverseName]).to eq(:contact)
    end
  end
end
```
