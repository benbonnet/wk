# Schema System

Schemas define the structure and validation rules for data entities. They are used for JSON Schema generation, OpenAPI documentation, LLM tool definitions, and frontend form generation.

## Architecture

```
            Core::Schema::Base
      (inherits from RubyLLM::Schema)
                  |
    Mixins:       |
    - Core::Schema::Translations (i18n support)
    - Core::Schema::Relationships (has_one, has_many)
                  |
                  v
        Core::Schema::Registry
    - Auto-registers schemas on class definition
    - find(slug) / find!(slug)
    - to_openapi_schemas / to_mock_data
```

## Core::Schema::Base

**Location:** `packs/core/app/lib/core/schema/base.rb`

### Class Methods

| Method | Description |
|--------|-------------|
| `title(value)` | Human-readable name |
| `slug(value)` | URL-friendly identifier (auto-derived from title) |
| `description(value)` | Schema description |
| `timestamps` | Adds `created_at`, `updated_at` fields |
| `soft_delete` | Adds `deleted_at` field |
| `to_full_schema` | Export with relationships and translations |
| `to_mock_data` | Export for frontend mocks |

### Field Types

From `RubyLLM::Schema`:

```ruby
string :field_name, description: "...", max_length: 255, format: "email", enum: [...], required: true/false
integer :field_name, description: "...", minimum: 0, maximum: 100
number :field_name, description: "..."
boolean :field_name, description: "..."
array :field_name, of: :string, description: "..."
object :field_name, description: "..." do
  string :nested_field
end
```

### Format Options

| Format | Description |
|--------|-------------|
| `"email"` | Email address |
| `"date"` | ISO date (YYYY-MM-DD) |
| `"date-time"` | ISO datetime |
| `"uri"` | URL |
| `"uuid"` | UUID string |

---

## Example Schema

```ruby
module ContactsService
  class ContactSchema < Core::Schema::Base
    title "Contact"
    description "A contact record with personal information"

    # Basic fields
    string :first_name, description: "First name", max_length: 255
    string :last_name, description: "Last name", max_length: 255
    string :email, format: "email", required: false
    string :phone, required: false
    string :company, required: false
    string :job_title, required: false
    string :gender, enum: %w[male female other prefer_not_to_say], required: false
    string :date_of_birth, format: "date", required: false
    array :tags, of: :string, required: false

    # Common helpers
    timestamps
    soft_delete

    # Relationships (see relationships.md)
    relationships do
      has_one :spouse, schema: :contact, inverse: :spouse
      has_many :addresses, schema: :address, inverse: :contact
      has_many :children, schema: :contact, inverse: :parents
      has_many :parents, schema: :contact, inverse: :children
    end

    # Translations
    translations(
      en: {
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email Address"
      },
      fr: {
        first_name: "Prenom",
        last_name: "Nom",
        email: "Adresse e-mail"
      }
    )
  end
end
```

---

## Schema Registry

**Location:** `packs/core/app/lib/core/schema/registry.rb`

Schemas are auto-registered when their class is defined (via `inherited` hook).

### API

```ruby
Core::Schema::Registry.all          # => Set of all schema classes
Core::Schema::Registry.slugs        # => ["contact", "address", ...]
Core::Schema::Registry.find("contact")   # => ContactSchema or nil
Core::Schema::Registry.find!("contact")  # => ContactSchema or raises NotFoundError
Core::Schema::Registry.clear!       # => Reset (for testing)
```

### OpenAPI Export

```ruby
Core::Schema::Registry.to_openapi_schemas
# => {
#   "contact" => { type: "object", properties: { ... } },
#   "contactInput" => { type: "object", properties: { ... } }
# }
```

### Mock Data Export

```ruby
Core::Schema::Registry.to_mock_data
# => [
#   { slug: "contact", title: "Contact", schema: {...}, relationships: [...], translations: {...} }
# ]
```

---

## Translations

**Location:** `packs/core/app/lib/core/schema/translations.rb`

```ruby
class MySchema < Core::Schema::Base
  translations(
    en: { field_name: "English Label" },
    fr: { field_name: "French Label" }
  )
end

MySchema.translations           # => { en: {...}, fr: {...} }
MySchema.t(:field_name)         # => "English Label" (default locale)
MySchema.t(:field_name, locale: :fr)  # => "French Label"
MySchema.translation_keys       # => [:field_name, ...]
```

---

## JSON Schema Output

```ruby
ContactSchema.new.to_json_schema
# => {
#   "type" => "object",
#   "properties" => {
#     "first_name" => { "type" => "string", "maxLength" => 255 },
#     "email" => { "type" => "string", "format" => "email" },
#     ...
#   },
#   "required" => ["first_name", "last_name"]
# }
```

---

## Usage in Tools

```ruby
class Create < Core::Tools::Base
  schema "contact"           # Links to ContactSchema
  params ContactSchema       # Uses schema for input validation (RubyLLM)

  def execute(contact: {}, **_)
    # schema_class returns ContactSchema
    # Can use for validation, etc.
  end
end
```

---

## Best Practices

1. **One schema per entity**: Keep schemas focused
2. **Use helpers**: `timestamps`, `soft_delete` for consistency
3. **Add translations**: All user-facing labels should be translated
4. **Define relationships**: Use the relationships DSL for entity links
5. **Descriptive fields**: Add `description:` for OpenAPI docs
6. **Enums for fixed values**: Use `enum:` instead of free text where appropriate
