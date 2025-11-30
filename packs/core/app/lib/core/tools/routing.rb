# frozen_string_literal: true

module Core
  module Tools
    module Routing
      extend ActiveSupport::Concern

      class_methods do
        def route(method:, scope: :collection, action: nil)
          @route_config = {
            method: method.to_sym,
            scope: scope.to_sym,
            action: action&.to_s
          }
        end

        def route_config
          @route_config ||= { method: :get, scope: :collection, action: nil }
        end

        def matches?(http_method:, scope:, action: nil)
          route_config[:method] == http_method.to_sym &&
            route_config[:scope] == scope.to_sym &&
            route_config[:action] == action&.to_s.presence
        end

        def collection?
          route_config[:scope] == :collection
        end

        def member?
          route_config[:scope] == :member
        end
      end
    end
  end
end
