# frozen_string_literal: true

require "rails_helper"

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  config.openapi_root = Rails.root.join("public").to_s

  # Define one or more Swagger documents and provide global metadata for each one
  config.openapi_specs = {
    "openapi.json" => {
      openapi: "3.0.1",
      info: {
        title: "API",
        version: "v1",
        description: "Auto-generated from Core::Tools DSL"
      },
      paths: {},
      servers: [
        { url: "/api/v1", description: "API v1" }
      ],
      components: {
        schemas: Core::Schema::Registry.to_openapi_schemas,
        securitySchemes: {
          bearerAuth: {
            type: :http,
            scheme: :bearer,
            bearerFormat: :JWT
          }
        }
      }
    }
  }

  # Specify the format of the output Swagger file
  config.openapi_format = :json
end
