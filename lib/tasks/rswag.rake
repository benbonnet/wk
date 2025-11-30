# frozen_string_literal: true

namespace :rswag do
  desc "Generate OpenAPI spec by running rswag tests (validates responses)"
  task generate: :environment do
    system("bundle exec rspec spec/requests/api/v1/tools_spec.rb --format Rswag::Specs::SwaggerFormatter --order defined")
  end

  desc "List all tools with rswag configuration"
  task list: :environment do
    Core::Features::Registry.all.each do |namespace, features|
      features.each do |feature_slug, feature_config|
        feature_config[:tools].each do |tool_class|
          next unless tool_class.rswag?

          config = tool_class.route_config
          next unless config

          path = "/api/v1/#{namespace}/#{feature_slug}"
          path += "/{id}" if config[:scope] == :member
          path += "/#{config[:action]}" if config[:action]

          examples = tool_class.rswag_config.examples.map { |e| e[:name] }.join(", ")

          puts "#{config[:method].to_s.upcase.ljust(6)} #{path.ljust(50)} #{examples}"
        end
      end
    end
  end

  desc "Validate all rswag examples have required fields"
  task validate: :environment do
    errors = []

    Core::Features::Registry.all.each do |namespace, features|
      features.each do |feature_slug, feature_config|
        feature_config[:tools].each do |tool_class|
          next unless tool_class.rswag?

          tool_class.rswag_config.examples.each do |ex|
            unless ex[:response]
              errors << "#{tool_class.name} example :#{ex[:name]} missing response"
            end
            unless ex[:status]
              errors << "#{tool_class.name} example :#{ex[:name]} missing status"
            end
          end
        end
      end
    end

    if errors.empty?
      puts "All rswag examples valid!"
    else
      errors.each { |e| puts "ERROR: #{e}" }
      exit 1
    end
  end
end
