# frozen_string_literal: true

module Ui
  module Views
    module Builders
      class ApiBuilder
        attr_reader :endpoints

        def initialize
          @endpoints = {}
        end

        def method_missing(name, method:, path:, **options)
          @endpoints[name.to_sym] = {
            method: method.to_s.upcase,
            path:,
            **options.compact
          }
        end

        def respond_to_missing?(*)
          true
        end
      end
    end
  end
end
