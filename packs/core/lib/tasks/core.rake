# frozen_string_literal: true

namespace :core do
  desc "Sync schemas, features, tools, and views from Registry to database"
  task sync: :environment do
    silent = ENV["SILENT"] == "true"
    Core::Sync.call(silent:)
  end

  desc "Export schema/feature data for frontend integration tests"
  task export_mocks: :environment do
    require "fileutils"
    require "json"

    silent = ENV["SILENT"] == "true"
    base_output_dir = ENV["OUTPUT_DIR"]

    packs_with_schemas = Core::Schema::Registry.all
      .map { |s| s.name&.split("::")&.first&.underscore }
      .compact
      .uniq

    packs_with_schemas.each do |pack_name|
      export_pack(pack_name, silent:, base_output_dir:)
    end
  end
end

def export_pack(pack_name, silent: false, base_output_dir: nil)
  pack_path = Rails.root.join("packs", pack_name)
  unless pack_path.exist?
    puts "Pack not found: #{pack_name}" unless silent
    return
  end

  Dir[pack_path.join("app/lib/**/*.rb")].sort.each { |f| require f }

  output_dir = if base_output_dir
    Pathname.new(base_output_dir).join(pack_name)
  else
    pack_path.join("app/frontend/__tests__/mocks")
  end
  FileUtils.mkdir_p(output_dir)

  pack_module = pack_name.camelize
  pack_schemas = Core::Schema::Registry.all.select do |schema|
    schema.name&.start_with?(pack_module)
  end

  if pack_schemas.empty?
    puts "No schemas found for pack: #{pack_name}" unless silent
    return
  end

  # Export schemas
  schemas_file = output_dir.join("schemas.json")
  schemas_data = pack_schemas.map(&:to_mock_data)
  File.write(schemas_file, JSON.pretty_generate(schemas_data))
  puts "#{pack_name}: Exported #{schemas_data.length} schemas" unless silent

  # Export relationships
  relationships_data = {}
  pack_schemas.each do |schema|
    rels = Core::Relationships::Registry.for_schema(schema.slug)
    relationships_data[schema.slug] = rels unless rels.empty?
  end

  if relationships_data.any?
    relationships_file = output_dir.join("relationships.json")
    File.write(relationships_file, JSON.pretty_generate(relationships_data))
    puts "#{pack_name}: Exported relationships" unless silent
  end

  # Export features
  export_pack_features(pack_name, output_dir, silent:)

  # Export views
  export_pack_views(pack_name, output_dir, silent:)

  puts "#{pack_name}: Mocks exported to #{output_dir}" unless silent
end

def export_pack_views(pack_name, output_dir, silent: false)
  pack_module = pack_name.camelize
  views_dir = output_dir.join("views")

  Core::Features::Registry.all.each do |namespace, features|
    features.each do |feature_slug, config|
      config[:views].each do |view_class|
        next unless view_class.name&.start_with?(pack_module)
        next unless view_class.respond_to?(:view_config) && view_class.has_view?

        FileUtils.mkdir_p(views_dir)
        view_slug = view_class.name.demodulize.underscore
        view_file = views_dir.join("#{feature_slug}_#{view_slug}.json")
        File.write(view_file, JSON.pretty_generate(view_class.view_config))
        puts "#{pack_name}: Exported view #{feature_slug}/#{view_slug}" unless silent
      end
    end
  end
end

def export_pack_features(pack_name, output_dir, silent: false)
  pack_module = pack_name.camelize
  features_data = []

  Core::Features::Registry.all.each do |namespace, features|
    features.each do |feature_slug, config|
      pack_tools = config[:tools].select { |t| t.name&.start_with?(pack_module) }
      next if pack_tools.empty?

      features_data << {
        namespace:,
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
    puts "#{pack_name}: Exported #{features_data.length} features" unless silent
  end
end

# Hook sync and mocks generation into db:migrate
Rake::Task["db:migrate"].enhance do
  Rake::Task["core:sync"].invoke
  Rake::Task["core:export_mocks"].invoke if Rails.env.development?
end
