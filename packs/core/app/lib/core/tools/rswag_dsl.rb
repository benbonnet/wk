# frozen_string_literal: true

module Core
  module Tools
    module RswagDsl
      extend ActiveSupport::Concern

      class_methods do
        # Main DSL entry point
        # @example
        #   rswag do
        #     response do
        #       object :meta do
        #         integer :deleted_count
        #       end
        #     end
        #
        #     example :success do
        #       request  ids: [1, 2, 3]
        #       response meta: { deleted_count: 3 }
        #       status   200
        #     end
        #   end
        def rswag(&block)
          @rswag_config ||= RswagConfig.new
          @rswag_config.instance_eval(&block) if block_given?
          @rswag_config
        end

        # Access rswag configuration
        def rswag_config
          @rswag_config
        end

        # Check if rswag is configured
        def rswag?
          @rswag_config.present?
        end
      end

      # Configuration container
      class RswagConfig
        attr_reader :response_schema, :examples

        def initialize
          @response_schema = nil
          @examples = []
        end

        # Define response schema
        # @yield [ResponseSchemaBuilder]
        def response(&block)
          builder = ResponseSchemaBuilder.new
          builder.instance_eval(&block)
          @response_schema = builder.to_schema
        end

        # Define an example
        # @param name [Symbol] Example name (e.g., :success, :not_found)
        # @yield [ExampleBuilder]
        def example(name, &block)
          builder = ExampleBuilder.new(name)
          builder.instance_eval(&block)
          @examples << builder.to_h
        end

        # Get examples by status code
        def examples_for_status(status)
          @examples.select { |ex| ex[:status] == status }
        end

        # Get success examples (2xx)
        def success_examples
          @examples.select { |ex| ex[:status] >= 200 && ex[:status] < 300 }
        end

        # Get error examples (4xx, 5xx)
        def error_examples
          @examples.select { |ex| ex[:status] >= 400 }
        end
      end

      # Builder for response schema (JSON Schema format)
      class ResponseSchemaBuilder
        def initialize
          @schema = { type: "object", properties: {} }
          @required = []
        end

        # Define string property
        def string(name, description: nil, format: nil, required: false)
          add_property(name, { type: "string", format:, description: }.compact, required)
        end

        # Define integer property
        def integer(name, description: nil, required: false)
          add_property(name, { type: "integer", description: }.compact, required)
        end

        # Define number property
        def number(name, description: nil, required: false)
          add_property(name, { type: "number", description: }.compact, required)
        end

        # Define boolean property
        def boolean(name, description: nil, required: false)
          add_property(name, { type: "boolean", description: }.compact, required)
        end

        # Define array property
        def array(name, of: nil, description: nil, required: false, &block)
          items = if block_given?
            nested = ResponseSchemaBuilder.new
            nested.instance_eval(&block)
            nested.to_schema
          elsif of
            case of
            when :string then { type: "string" }
            when :integer then { type: "integer" }
            when :number then { type: "number" }
            when :boolean then { type: "boolean" }
            when String then { "$ref" => "#/components/schemas/#{of}" }
            else { type: "object" }
            end
          else
            { type: "object" }
          end

          add_property(name, { type: "array", items:, description: }.compact, required)
        end

        # Define nested object property
        def object(name, description: nil, required: false, &block)
          nested = ResponseSchemaBuilder.new
          nested.instance_eval(&block) if block_given?
          add_property(name, nested.to_schema.merge(description:).compact, required)
        end

        # Reference another schema
        def ref(name, schema_name, description: nil, required: false)
          add_property(name, { "$ref" => "#/components/schemas/#{schema_name}", description: }.compact, required)
        end

        def to_schema
          schema = @schema.dup
          schema[:required] = @required unless @required.empty?
          schema
        end

        private

        def add_property(name, definition, required)
          @schema[:properties][name.to_sym] = definition
          @required << name.to_s if required
        end
      end

      # Builder for examples
      class ExampleBuilder
        def initialize(name)
          @name = name
          @request_data = nil
          @response_data = nil
          @status_code = 200
          @description = nil
        end

        # Define request payload
        def request(data = nil, **kwargs)
          @request_data = data || kwargs
        end

        # Define response payload
        def response(data = nil, **kwargs)
          @response_data = data || kwargs
        end

        # Define HTTP status code
        def status(code)
          @status_code = code
        end

        # Optional description
        def description(text)
          @description = text
        end

        def to_h
          {
            name: @name,
            request: @request_data,
            response: @response_data,
            status: @status_code,
            description: @description
          }.compact
        end
      end
    end
  end
end
