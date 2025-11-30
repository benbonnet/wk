# Relationships System

The Relationships module provides a DSL for defining entity relationships within schemas. It enables bidirectional linking between entities with cardinality constraints.

## Architecture

```
    Core::Schema::Base
           |
           | includes
           v
    Core::Schema::Relationships
           |
           | provides DSL
           v
    RelationshipBuilder
    - has_one(name, schema:, inverse:)
    - has_many(name, schema:, inverse:)
    - belongs_to(name, schema:, inverse:)
```

## Location

`packs/core/app/lib/core/schema/relationships.rb`

---

## DSL

### has_one

Defines a single relationship to another entity.

```ruby
relationships do
  has_one :spouse, schema: :contact, inverse: :spouse
  has_one :company, schema: :organization, inverse: :employees
end
```

### has_many

Defines a collection relationship to multiple entities.

```ruby
relationships do
  has_many :addresses, schema: :address, inverse: :contact
  has_many :children, schema: :contact, inverse: :parents
end
```

### belongs_to

Alias for `has_one` - for semantic clarity.

```ruby
relationships do
  belongs_to :organization, schema: :organization, inverse: :contacts
end
```

---

## Options

| Option | Type | Description |
|--------|------|-------------|
| `schema` | Symbol/String | Target schema slug (required) |
| `inverse` | Symbol | Name of the inverse relationship on target |
| `description` | String | Human-readable description |

---

## Full Example

```ruby
module ContactsService
  class ContactSchema < Core::Schema::Base
    title "Contact"

    string :first_name
    string :last_name

    relationships do
      # Self-referential: a contact can have one spouse (also a contact)
      has_one :spouse, schema: :contact, inverse: :spouse

      # One-to-many: a contact has many addresses
      has_many :addresses, schema: :address, inverse: :contact

      # Many-to-many through inverse: parents <-> children
      has_many :children, schema: :contact, inverse: :parents
      has_many :parents, schema: :contact, inverse: :children

      # Belongs to organization
      belongs_to :organization, schema: :organization, inverse: :contacts,
                 description: "The organization this contact works for"
    end
  end
end
```

---

## Class Methods

| Method | Description |
|--------|-------------|
| `relationships(&block)` | Define relationships or retrieve definitions |
| `has_relationship?(name)` | Check if relationship exists |
| `find_relationship(name)` | Get relationship definition by name |

### Usage

```ruby
ContactSchema.relationships
# => [
#   { name: :spouse, cardinality: :one, target_schema: "contact", inverse_name: :spouse },
#   { name: :addresses, cardinality: :many, target_schema: "address", inverse_name: :contact },
#   ...
# ]

ContactSchema.has_relationship?(:spouse)  # => true
ContactSchema.has_relationship?(:foo)     # => false

ContactSchema.find_relationship(:spouse)
# => { name: :spouse, cardinality: :one, target_schema: "contact", inverse_name: :spouse }
```

---

## Relationship Definition Structure

Each relationship definition is a hash:

```ruby
{
  name: :addresses,           # Relationship name on this schema
  cardinality: :many,         # :one or :many
  target_schema: "address",   # Target schema slug
  inverse_name: :contact,     # Inverse relationship name on target
  description: nil            # Optional description
}
```

---

## Best Practices

1. **Always define inverses**: Bidirectional relationships require inverse definitions
2. **Use semantic names**: `belongs_to` for clarity when appropriate
3. **Self-referential relationships**: Use the same schema for both sides
4. **Add descriptions**: Document complex relationships
5. **Cardinality matters**: Use `has_one` vs `has_many` correctly for data integrity
