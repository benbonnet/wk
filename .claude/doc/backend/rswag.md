# Rswag DSL

The Rswag DSL provides inline OpenAPI documentation for tools. It allows defining response schemas and examples directly in tool classes, which are then used to generate OpenAPI specifications.

## Architecture

```
    Core::Tools::Base
           |
           | includes
           v
    Core::Tools::RswagDsl
           |
           | provides
           v
    RswagConfig
    - response(&block)     -> ResponseSchemaBuilder
    - example(name, &block) -> ExampleBuilder
```

## Location

`packs/core/app/lib/core/tools/rswag_dsl.rb`

---

## Basic Usage

```ruby
class BulkDelete < Core::Tools::Base
  route method: :post, scope: :collection, action: "bulk_delete"
  schema "contact"

  rswag do
    response do
      object :meta do
        integer :deleted_count
      end
    end

    example :success do
      request  ids: [1, 2, 3]
      response meta: { deleted_count: 3 }
      status   200
    end
  end

  def execute(ids:, **)
    count = items.where(id: ids).update_all(deleted_at: Time.current)
    { meta: { deleted_count: count } }
  end
end
```

---

## Response Schema DSL

### Primitive Types

```ruby
response do
  string :message, description: "Status message"
  integer :count, description: "Item count"
  number :total, description: "Total amount"
  boolean :success, description: "Success flag"
end
```

### Arrays

```ruby
response do
  # Array of primitives
  array :ids, of: :integer
  array :tags, of: :string

  # Array of objects
  array :items do
    string :name
    integer :quantity
  end

  # Array referencing a schema
  array :contacts, of: "contact"
end
```

### Nested Objects

```ruby
response do
  object :meta do
    integer :page
    integer :per_page
    integer :total
    integer :total_pages
  end

  object :user do
    string :name
    string :email
    object :preferences do
      boolean :notifications
      string :theme
    end
  end
end
```

### Schema References

```ruby
response do
  ref :data, "contact", description: "The contact record"

  array :items, of: "contact"
end
```

### Required Fields

```ruby
response do
  string :id, required: true
  string :name, required: true
  string :description  # optional
end
```

---

## Examples DSL

### Basic Example

```ruby
rswag do
  example :success do
    request  name: "John", email: "john@example.com"
    response data: { id: 1, name: "John" }
    status   201
  end
end
```

### Multiple Examples

```ruby
rswag do
  example :success do
    description "Successfully created contact"
    request  name: "John"
    response data: { id: 1, name: "John" }
    status   201
  end

  example :validation_error do
    description "Invalid input data"
    request  name: ""
    response error: "Name can't be blank"
    status   422
  end

  example :not_found do
    description "Contact not found"
    request  id: 999
    response error: "Not found"
    status   404
  end
end
```

---

## Accessing Configuration

### Check if Configured

```ruby
MyTool.rswag?  # => true/false
```

### Get Configuration

```ruby
config = MyTool.rswag_config

config.response_schema  # => { type: "object", properties: {...} }
config.examples         # => [{ name: :success, ... }, ...]
```

### Filter Examples

```ruby
config.examples_for_status(200)  # => Examples with status 200
config.success_examples          # => Examples with 2xx status
config.error_examples            # => Examples with 4xx/5xx status
```

---

## Generated Schema Format

The response DSL generates JSON Schema compatible structures:

```ruby
response do
  object :meta do
    integer :page, required: true
    integer :total
  end
  array :data, of: "contact"
end

# Generates:
{
  type: "object",
  properties: {
    meta: {
      type: "object",
      properties: {
        page: { type: "integer" },
        total: { type: "integer" }
      },
      required: ["page"]
    },
    data: {
      type: "array",
      items: { "$ref" => "#/components/schemas/contact" }
    }
  }
}
```

---

## Example Structure

```ruby
{
  name: :success,
  request: { ids: [1, 2, 3] },
  response: { meta: { deleted_count: 3 } },
  status: 200,
  description: "Bulk delete successful"
}
```

---

## Integration with Rswag Specs

The DSL configuration is consumed by rswag request specs:

```ruby
# In spec/requests/api/v1/tools_spec.rb
RSpec.describe "API Tools" do
  Core::Features::Registry.all_tools.each do |tool_class|
    next unless tool_class.rswag?

    config = tool_class.rswag_config
    path build_api_path(tool_class) do
      config.examples.each do |example|
        response example[:status], example[:description] do
          schema config.response_schema
          run_test!
        end
      end
    end
  end
end
```

---

## Best Practices

1. **Document all public tools**: Add rswag blocks to API-facing tools
2. **Include multiple examples**: Cover success and error cases
3. **Use descriptive names**: `:success`, `:not_found`, `:validation_error`
4. **Reference schemas**: Use `ref` for complex data types
5. **Add descriptions**: Document what each field represents
6. **Match actual responses**: Keep examples in sync with tool output
