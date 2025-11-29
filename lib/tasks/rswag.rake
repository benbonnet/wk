# frozen_string_literal: true

namespace :rswag do
  desc "Generate OpenAPI spec from DSL (without running tests)"
  task generate: :environment do
    spec = build_openapi_spec
    path = Rails.root.join("public", "openapi.json")
    File.write(path, JSON.pretty_generate(spec))
    puts "OpenAPI spec written to #{path}"
  end

  desc "Generate OpenAPI spec by running rswag tests (validates responses)"
  task generate_with_tests: :environment do
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

  private

  def build_openapi_spec
    {
      openapi: "3.0.1",
      info: {
        title: "API",
        version: "v1",
        description: "Auto-generated from Core::Tools DSL"
      },
      servers: [
        { url: "/api/v1", description: "API v1" }
      ],
      paths: build_paths,
      components: {
        schemas: Core::Schema::Registry.to_openapi_schemas,
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    }
  end

  def build_paths
    paths = {}

    Core::Features::Registry.all.each do |namespace, features|
      features.each do |feature_slug, feature_config|
        feature_config[:tools].each do |tool_class|
          next unless tool_class.rswag?

          config = tool_class.route_config
          next unless config

          path = "/#{namespace}/#{feature_slug}"
          path += "/{id}" if config[:scope] == :member
          path += "/#{config[:action]}" if config[:action]

          paths[path] ||= {}
          paths[path][config[:method].to_s] = build_operation(tool_class, feature_slug, config)
        end
      end
    end

    paths
  end

  def build_operation(tool_class, feature_slug, config)
    rswag_config = tool_class.rswag_config
    operation = {
      summary: tool_class.respond_to?(:description) ? tool_class.description : tool_class.name.demodulize.titleize,
      operationId: "#{feature_slug}_#{tool_class.name.demodulize.underscore}",
      tags: [feature_slug.to_s.titleize],
      security: [{ bearerAuth: [] }],
      responses: {}
    }

    # Add path parameter for member routes
    if config[:scope] == :member
      operation[:parameters] ||= []
      operation[:parameters] << {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer" }
      }
    end

    # Success responses with examples
    rswag_config.success_examples.each do |ex|
      status = ex[:status].to_s
      operation[:responses][status] ||= {
        description: ex[:description] || ex[:name].to_s.titleize,
        content: {
          "application/json" => {
            schema: rswag_config.response_schema || { type: "object" },
            examples: {}
          }
        }
      }

      if ex[:response]
        operation[:responses][status][:content]["application/json"][:examples][ex[:name].to_s] = {
          value: ex[:response]
        }
      end
    end

    # Error responses
    rswag_config.error_examples.group_by { |ex| ex[:status] }.each do |status, examples|
      operation[:responses][status.to_s] = {
        description: examples.first[:description] || Rack::Utils::HTTP_STATUS_CODES[status],
        content: {
          "application/json" => {
            examples: examples.each_with_object({}) do |ex, hash|
              hash[ex[:name].to_s] = { value: ex[:response] } if ex[:response]
            end
          }
        }
      }
    end

    operation
  end
end
