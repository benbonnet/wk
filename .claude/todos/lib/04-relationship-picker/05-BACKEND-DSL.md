# Backend DSL: relationship_picker

## Current Implementation Status

### ViewBuilder (lines 306-319) ✅ Implemented

```ruby
def relationship_picker(name, cardinality:, relation_schema:, **options, &block)
  builder = Builders::RelationshipPickerBuilder.new(self)
  yield(builder) if block_given?

  @elements << {
    type: "RELATIONSHIP_PICKER",
    name: "#{name}_attributes",      # Auto-appends _attributes
    cardinality:,
    relationSchema: relation_schema,
    columns: builder.columns,
    template: builder.form_fields,
    **options.compact
  }.compact
end
```

### RelationshipPickerBuilder (current) ⚠️ Incomplete

```ruby
class RelationshipPickerBuilder
  attr_reader :columns, :form_fields

  def initialize(parent_builder)
    @parent_builder = parent_builder
    @columns = []
    @form_fields = []
  end

  def column(name, kind:, **options)
    @columns << {
      name: name.to_s,
      kind:,
      label: options[:label]
    }.compact
  end

  def form(&block)
    # Uses parent builder to capture form elements
    old_elements = @parent_builder.elements
    @parent_builder.instance_variable_set(:@elements, [])
    @parent_builder.instance_eval(&block)
    @form_fields = @parent_builder.elements
    @parent_builder.instance_variable_set(:@elements, old_elements)
  end
end
```

## Missing Features

| Option | Purpose | Status |
|--------|---------|--------|
| `label` | Field label | ❌ Missing |
| `addLabel` | "Add" button text | ❌ Missing |
| `emptyMessage` | Empty state text | ❌ Missing |
| `searchPlaceholder` | Search input placeholder | ❌ Missing |
| `confirmLabel` | Confirm button text | ❌ Missing |

## Required Backend Updates

### 1. Extend RelationshipPickerBuilder

```ruby
# packs/ui/lib/ui/views/builders/relationship_picker_builder.rb

class RelationshipPickerBuilder
  attr_reader :columns, :form_fields, :options

  def initialize(parent_builder)
    @parent_builder = parent_builder
    @columns = []
    @form_fields = []
    @options = {}
  end

  def column(name, kind:, **opts)
    @columns << {
      name: name.to_s,
      kind:,
      label: opts[:label]
    }.compact
  end

  def form(&block)
    old_elements = @parent_builder.elements
    @parent_builder.instance_variable_set(:@elements, [])
    @parent_builder.instance_eval(&block)
    @form_fields = @parent_builder.elements
    @parent_builder.instance_variable_set(:@elements, old_elements)
  end

  # NEW: Option methods
  def label(value)
    @options[:label] = value
  end

  def add_label(value)
    @options[:addLabel] = value
  end

  def empty_message(value)
    @options[:emptyMessage] = value
  end

  def search_placeholder(value)
    @options[:searchPlaceholder] = value
  end

  def confirm_label(value)
    @options[:confirmLabel] = value
  end
end
```

### 2. Update ViewBuilder to merge options

```ruby
def relationship_picker(name, cardinality:, relation_schema:, **options, &block)
  builder = Builders::RelationshipPickerBuilder.new(self)
  yield(builder) if block_given?

  @elements << {
    type: "RELATIONSHIP_PICKER",
    name: "#{name}_attributes",
    cardinality:,
    relationSchema: relation_schema,
    columns: builder.columns,
    template: builder.form_fields,
    **builder.options,    # ← ADD THIS
    **options.compact
  }.compact
end
```

## Usage Example

```ruby
class ParentsView
  include UI::Views::BaseView

  view do
    form do
      field :first_name, kind: :INPUT_TEXT, label: "first_name"

      relationship_picker :contacts,
        cardinality: :many,
        relation_schema: :contact do

          # Table columns (Layer 2)
          column :name, kind: :DISPLAY_TEXT, label: "name"
          column :email, kind: :DISPLAY_TEXT, label: "email"

          # Create form fields (Layer 3)
          form do
            field :name, kind: :INPUT_TEXT, label: "name"
            field :email, kind: :INPUT_TEXT, label: "email"
          end

          # Options (NEW)
          label "contacts"
          add_label "add_contact"
          empty_message "no_contacts_selected"
          search_placeholder "search_contacts"
          confirm_label "confirm_selection"
        end

      submit
    end
  end
end
```

## Generated JSON

```json
{
  "type": "VIEW",
  "elements": [{
    "type": "FORM",
    "elements": [
      { "type": "COMPONENT", "name": "first_name", "kind": "INPUT_TEXT", "label": "first_name" },
      {
        "type": "RELATIONSHIP_PICKER",
        "name": "contacts_attributes",
        "cardinality": "many",
        "relationSchema": "contact",
        "columns": [
          { "name": "name", "kind": "DISPLAY_TEXT", "label": "name" },
          { "name": "email", "kind": "DISPLAY_TEXT", "label": "email" }
        ],
        "template": [
          { "type": "COMPONENT", "name": "name", "kind": "INPUT_TEXT", "label": "name" },
          { "type": "COMPONENT", "name": "email", "kind": "INPUT_TEXT", "label": "email" }
        ],
        "label": "contacts",
        "addLabel": "add_contact",
        "emptyMessage": "no_contacts_selected",
        "searchPlaceholder": "search_contacts",
        "confirmLabel": "confirm_selection"
      },
      { "type": "SUBMIT" }
    ]
  }]
}
```

## Rails Integration

### Model

```ruby
class Parent < ApplicationRecord
  has_many :contacts
  accepts_nested_attributes_for :contacts, allow_destroy: true
end
```

### Controller

```ruby
def parent_params
  params.require(:parent).permit(
    :first_name,
    :last_name,
    contacts_attributes: [:id, :name, :email, :_destroy]
  )
end
```

### Submission Payload

```json
{
  "parent": {
    "first_name": "John",
    "contacts_attributes": [
      { "id": 1, "name": "Updated" },
      { "id": 2, "_destroy": 1 },
      { "name": "New Contact" }
    ]
  }
}
```

- `id` present → update existing
- `id` + `_destroy: 1` → mark for deletion
- no `id` → create new
