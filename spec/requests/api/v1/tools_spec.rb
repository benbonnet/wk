# frozen_string_literal: true

require "swagger_helper"

# Helper to build API path from namespace, feature, and route config
def build_api_path(namespace, feature_slug, config)
  base = "/api/v1/#{namespace}/#{feature_slug}"
  parts = []
  parts << "{id}" if config[:scope] == :member
  parts << config[:action] if config[:action]
  parts.empty? ? base : "#{base}/#{parts.join('/')}"
end

RSpec.describe "API", type: :request do
  # Dynamically build specs from Core::Features::Registry
  # Each tool with rswag? configured gets documented and tested

  Core::Features::Registry.all.each do |namespace, features|
    features.each do |feature_slug, feature_config|
      describe "#{namespace}/#{feature_slug}" do
        feature_config[:tools].each do |tool_class|
          next unless tool_class.route_config
          next unless tool_class.rswag?

          config = tool_class.route_config
          api_path = build_api_path(namespace, feature_slug, config)
          http_method = config[:method]
          rswag_config = tool_class.rswag_config

          path api_path do
            operation_desc = tool_class.respond_to?(:description) ? tool_class.description : nil
            operation_desc ||= tool_class.name.demodulize.titleize

            public_send(http_method, operation_desc) do
              tags feature_slug.to_s.titleize
              operationId "#{feature_slug}_#{tool_class.name.demodulize.underscore}"
              produces "application/json"
              security [{ bearerAuth: [] }]

              # Add path parameter for member routes
              if config[:scope] == :member
                parameter name: :id, in: :path, type: :integer, required: true
              end

              # Parameters from params DSL (RubyLLM::Schema)
              if tool_class.respond_to?(:params_schema) && tool_class.params_schema
                params_schema = tool_class.params_schema

                if http_method == :get
                  # Query parameters from schema properties
                  params_schema.properties.each do |name, prop|
                    parameter name: name,
                              in: :query,
                              schema: { type: prop[:type] },
                              required: prop[:required] || false,
                              description: prop[:description]
                  end
                else
                  # Request body
                  consumes "application/json"
                  parameter name: :body, in: :body, schema: params_schema.to_json_schema
                end
              end

              # Success responses from rswag config
              rswag_config.success_examples.each do |ex|
                response ex[:status].to_s, ex[:description] || ex[:name].to_s.titleize do
                  schema rswag_config.response_schema if rswag_config.response_schema

                  # Add example to OpenAPI
                  if ex[:response]
                    example "application/json", ex[:name], ex[:response]
                  end

                  context ex[:name].to_s do
                    let(:body) { ex[:request] }
                    let(:Authorization) { "Bearer test-token" }

                    run_test!
                  end
                end
              end

              # Error responses
              rswag_config.error_examples.group_by { |ex| ex[:status] }.each do |status, examples|
                response status.to_s, examples.first[:description] || Rack::Utils::HTTP_STATUS_CODES[status] do
                  examples.each do |ex|
                    example "application/json", ex[:name], ex[:response] if ex[:response]

                    context ex[:name].to_s do
                      let(:body) { ex[:request] }
                      let(:Authorization) { "Bearer test-token" }

                      run_test!
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
