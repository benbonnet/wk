# 16 - Spec Helper

## File: packs/core/spec/spec_helper.rb

```ruby
# frozen_string_literal: true

require "rails_helper"

RSpec.configure do |config|
  config.before(:each) do
    Core::Schema::Registry.clear!
    Core::Relationships::Registry.reload!
    Core::Features::Registry.clear!
  end
end
```

## Shared Examples: packs/core/spec/support/shared_examples/schema_examples.rb

```ruby
# frozen_string_literal: true

RSpec.shared_examples "a valid schema" do
  it "has a title" do
    expect(described_class.title).to be_present
  end

  it "has a slug" do
    expect(described_class.slug).to be_present
    expect(described_class.slug).to match(/^[a-z0-9-]+$/)
  end

  it "has properties" do
    expect(described_class.properties).to be_a(Hash)
  end

  it "generates valid JSON schema" do
    expect { described_class.new.to_json_schema }.not_to raise_error
  end
end

RSpec.shared_examples "a schema with relationships" do
  it "has relationship definitions" do
    expect(described_class.relationships).to be_an(Array)
    expect(described_class.relationships).not_to be_empty
  end

  it "has valid relationship structure" do
    described_class.relationships.each do |rel|
      expect(rel).to have_key(:name)
      expect(rel).to have_key(:cardinality)
      expect(rel).to have_key(:target_schema)
      expect(rel[:cardinality]).to be_in([:one, :many])
    end
  end
end

RSpec.shared_examples "a schema with translations" do
  it "has translation data" do
    expect(described_class.translations).to be_a(Hash)
    expect(described_class.translations).not_to be_empty
  end

  it "supports English locale" do
    expect(described_class.translations).to have_key(:en)
  end
end
```

## Shared Examples: packs/core/spec/support/shared_examples/tool_examples.rb

```ruby
# frozen_string_literal: true

RSpec.shared_examples "a collection tool" do
  it "has route config for collection" do
    expect(described_class.route_config[:scope]).to eq(:collection)
  end

  it "is a collection tool" do
    expect(described_class.collection?).to be true
  end
end

RSpec.shared_examples "a member tool" do
  it "has route config for member" do
    expect(described_class.route_config[:scope]).to eq(:member)
  end

  it "is a member tool" do
    expect(described_class.member?).to be true
  end
end

RSpec.shared_examples "a tool with schema" do
  it "has a schema slug" do
    expect(described_class.schema_slug).to be_present
  end

  it "can find schema class" do
    # Requires schema to be registered first
    expect(described_class.schema_class).not_to be_nil
  end
end
```

## Factory: packs/core/spec/factories/core.rb

```ruby
# frozen_string_literal: true

FactoryBot.define do
  factory :core_item, class: "Item" do
    association :created_by, factory: :user
    schema_slug { "contact" }
    tool_slug { "create" }
    data { { "first_name" => "John", "last_name" => "Doe" } }
  end

  factory :core_item_relationship, class: "ItemRelationship" do
    association :source_item, factory: :core_item
    association :target_item, factory: :core_item
    relationship_type { "children" }
  end
end
```
