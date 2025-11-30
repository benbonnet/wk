# 14 - Rake Tasks (Frontend Mock Generation)

## File: packs/core/lib/tasks/core.rake

```ruby
# frozen_string_literal: true

namespace :core do
  desc "Export schema/feature data for frontend integration tests (per pack)"
  task :export_mocks, [:pack_name] => :environment do |_t, args|
    require "fileutils"
    require "json"

    pack_name = args[:pack_name]
    unless pack_name
      puts "Usage: rake core:export_mocks[contacts_service]"
      puts "       rake core:export_mocks[all]"
      exit 1
    end

    if pack_name == "all"
      export_all_packs
    else
      export_pack(pack_name)
    end
  end

  desc "Generate TypeScript types from schemas (per pack)"
  task :generate_types, [:pack_name] => :environment do |_t, args|
    require "fileutils"

    pack_name = args[:pack_name]
    unless pack_name
      puts "Usage: rake core:generate_types[contacts_service]"
      exit 1
    end

    generate_pack_types(pack_name)
  end

  private

  def export_all_packs
    # Find all packs with schemas
    packs_with_schemas = Core::Schema::Registry.all
      .map { |s| s.name&.split("::")&.first&.underscore }
      .compact
      .uniq

    packs_with_schemas.each do |pack_name|
      export_pack(pack_name)
    end
  end

  def export_pack(pack_name)
    pack_path = Rails.root.join("packs", pack_name)
    unless pack_path.exist?
      puts "Pack not found: #{pack_name}"
      return
    end

    # Output relative to the pack's frontend test directory
    output_dir = pack_path.join("app/frontend/__tests__/mocks")
    FileUtils.mkdir_p(output_dir)

    # Find schemas from this pack
    pack_module = pack_name.camelize
    pack_schemas = Core::Schema::Registry.all.select do |schema|
      schema.name&.start_with?(pack_module)
    end

    if pack_schemas.empty?
      puts "No schemas found for pack: #{pack_name}"
      return
    end

    # Export schemas
    schemas_file = output_dir.join("schemas.json")
    schemas_data = pack_schemas.map(&:to_mock_data)
    File.write(schemas_file, JSON.pretty_generate(schemas_data))
    puts "#{pack_name}: Exported #{schemas_data.length} schemas"

    # Export relationships for these schemas
    relationships_data = {}
    pack_schemas.each do |schema|
      rels = Core::Relationships::Registry.for_schema(schema.slug)
      relationships_data[schema.slug] = rels unless rels.empty?
    end

    if relationships_data.any?
      relationships_file = output_dir.join("relationships.json")
      File.write(relationships_file, JSON.pretty_generate(relationships_data))
      puts "#{pack_name}: Exported relationships"
    end

    # Export sample items for each schema
    pack_schemas.each do |schema|
      items = Item.where(schema_slug: schema.slug).limit(10)
      next if items.empty?

      items_file = output_dir.join("#{schema.slug}_items.json")
      items_data = items.map do |item|
        item.data.merge(
          "id" => item.id,
          "created_at" => item.created_at,
          "updated_at" => item.updated_at
        )
      end
      File.write(items_file, JSON.pretty_generate(items_data))
      puts "#{pack_name}: Exported #{items_data.length} #{schema.slug} items"
    end

    # Export views if any
    export_pack_views(pack_name, output_dir)

    # Export features/tools config
    export_pack_features(pack_name, output_dir)

    puts "#{pack_name}: Mocks exported to #{output_dir}"
  end

  def export_pack_views(pack_name, output_dir)
    views_dir = output_dir.join("views")

    Core::Features::Registry.all.each do |namespace, features|
      features.each do |feature_slug, config|
        config[:views].each do |view_class|
          # Check if view belongs to this pack
          next unless view_class.name&.start_with?(pack_name.camelize)
          next unless view_class.respond_to?(:view_config)

          FileUtils.mkdir_p(views_dir)
          view_slug = view_class.name.demodulize.underscore
          view_file = views_dir.join("#{feature_slug}_#{view_slug}.json")
          File.write(view_file, JSON.pretty_generate(view_class.view_config))
          puts "#{pack_name}: Exported view #{feature_slug}/#{view_slug}"
        end
      end
    end
  end

  def export_pack_features(pack_name, output_dir)
    pack_module = pack_name.camelize
    features_data = []

    Core::Features::Registry.all.each do |namespace, features|
      features.each do |feature_slug, config|
        # Check if any tool belongs to this pack
        pack_tools = config[:tools].select { |t| t.name&.start_with?(pack_module) }
        next if pack_tools.empty?

        features_data << {
          namespace: namespace,
          slug: feature_slug,
          schema: config[:schema],
          tools: pack_tools.map do |tool|
            {
              name: tool.name.demodulize,
              route: tool.route_config
            }
          end
        }
      end
    end

    if features_data.any?
      features_file = output_dir.join("features.json")
      File.write(features_file, JSON.pretty_generate(features_data))
      puts "#{pack_name}: Exported #{features_data.length} features"
    end
  end

  def generate_pack_types(pack_name)
    pack_path = Rails.root.join("packs", pack_name)
    unless pack_path.exist?
      puts "Pack not found: #{pack_name}"
      return
    end

    output_file = pack_path.join("app/frontend/types/generated/schemas.ts")
    FileUtils.mkdir_p(File.dirname(output_file))

    pack_module = pack_name.camelize
    pack_schemas = Core::Schema::Registry.all.select do |schema|
      schema.name&.start_with?(pack_module)
    end

    if pack_schemas.empty?
      puts "No schemas found for pack: #{pack_name}"
      return
    end

    content = <<~TS
      // Auto-generated by: rake core:generate_types[#{pack_name}]
      // Do not edit manually

    TS

    pack_schemas.each do |schema|
      type_name = schema.title.gsub(/\s+/, "")
      content += generate_typescript_interface(schema, type_name)
      content += "\n"
    end

    File.write(output_file, content)
    puts "#{pack_name}: Generated TypeScript types at #{output_file}"
  end

  def generate_typescript_interface(schema, type_name)
    lines = ["export interface #{type_name} {"]
    lines << "  id: number;"

    schema.properties.each do |name, prop|
      ts_type = json_schema_to_ts_type(prop)
      optional = schema.required_properties.include?(name) ? "" : "?"
      lines << "  #{name}#{optional}: #{ts_type};"
    end

    # Add relationship types
    schema.relationships.each do |rel|
      target_type = rel[:target_schema].to_s.camelize
      if rel[:cardinality] == :one
        lines << "  #{rel[:name]}?: #{target_type} | null;"
      else
        lines << "  #{rel[:name]}?: #{target_type}[];"
      end
    end

    lines << "  created_at?: string;"
    lines << "  updated_at?: string;"
    lines << "}"
    lines.join("\n")
  end

  def json_schema_to_ts_type(prop)
    case prop[:type]
    when "string"
      if prop[:enum]
        prop[:enum].map { |v| "\"#{v}\"" }.join(" | ")
      else
        "string"
      end
    when "integer", "number"
      "number"
    when "boolean"
      "boolean"
    when "array"
      item_type = prop[:items] ? json_schema_to_ts_type(prop[:items]) : "unknown"
      "#{item_type}[]"
    when "object"
      "Record<string, unknown>"
    else
      "unknown"
    end
  end
end
```

## Usage

```bash
# Export mocks for a specific pack
bin/rails core:export_mocks[contacts_service]

# Export mocks for all packs with schemas
bin/rails core:export_mocks[all]

# Generate TypeScript types for a pack
bin/rails core:generate_types[contacts_service]
```

## Output Structure (per pack)

```
packs/contacts_service/
└── app/frontend/
    ├── __tests__/mocks/
    │   ├── schemas.json           # Pack schemas
    │   ├── relationships.json     # Relationships for pack schemas
    │   ├── features.json          # Features/tools config
    │   ├── contact_items.json     # Sample items (if exist in DB)
    │   └── views/
    │       ├── contacts_index.json
    │       └── contacts_form.json
    └── types/generated/
        └── schemas.ts             # TypeScript interfaces
```

## Spec: packs/core/spec/lib/tasks/core_rake_spec.rb

```ruby
# frozen_string_literal: true

require "rails_helper"
require "rake"

RSpec.describe "core:export_mocks" do
  before(:all) do
    Rails.application.load_tasks
  end

  before(:each) do
    Core::Schema::Registry.clear!
    Core::Features::Registry.clear!
    Rake::Task["core:export_mocks"].reenable
  end

  let(:contact_schema) do
    Class.new(Core::Schema::Base) do
      def self.name
        "ContactsService::ContactSchema"
      end
      title "Contact"
      string :name

      relationships do
        has_many :addresses, schema: :address
      end

      translations(en: { name: "Name" })
    end
  end

  before do
    Core::Schema::Registry.register(contact_schema)

    # Create pack directory structure
    FileUtils.mkdir_p(Rails.root.join("packs/contacts_service/app/frontend"))
  end

  it "exports schemas to pack's frontend test directory" do
    Rake::Task["core:export_mocks"].invoke("contacts_service")

    output_file = Rails.root.join(
      "packs/contacts_service/app/frontend/__tests__/mocks/schemas.json"
    )
    expect(File.exist?(output_file)).to be true

    data = JSON.parse(File.read(output_file))
    expect(data.first["slug"]).to eq("contact")
  end

  it "requires pack name argument" do
    expect { Rake::Task["core:export_mocks"].invoke }
      .to output(/Usage:/).to_stdout
  end

  after(:each) do
    FileUtils.rm_rf(Rails.root.join("packs/contacts_service/app/frontend/__tests__"))
    FileUtils.rm_rf(Rails.root.join("packs/contacts_service/app/frontend/types"))
  end
end
```
