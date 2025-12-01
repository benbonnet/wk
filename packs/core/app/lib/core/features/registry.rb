# frozen_string_literal: true

module Core
  module Features
    class Registry
      API_PREFIX = "/api/v1"

      class << self
        def all
          @all ||= {}
        end

        def clear!
          @all = {}
        end

        def register(namespace:, feature:, schema: nil, tools: [], views: [])
          all[namespace.to_sym] ||= {}
          all[namespace.to_sym][feature.to_sym] = {
            schema:,
            tools: Array(tools),
            views: Array(views)
          }
        end

        def find(namespace, feature)
          all.dig(namespace.to_sym, feature.to_sym)
        end

        def tools_for(namespace, feature)
          find(namespace, feature)&.dig(:tools) || []
        end

        def views_for(namespace, feature)
          find(namespace, feature)&.dig(:views) || []
        end

        def find_tool(namespace, feature, http_method:, scope:, action: nil)
          tools_for(namespace, feature).find do |tool|
            tool.matches?(http_method:, scope:, action:)
          end
        end

        def find_view(namespace, feature, view_name)
          views_for(namespace, feature).find do |view|
            view_slug(view) == view_name.to_s
          end
        end

        # Generate complete view config with derived URL and API
        # @param namespace [String, Symbol] e.g., "workspaces"
        # @param feature [String, Symbol] e.g., "rib_check_requests"
        # @param view_name [String, Symbol] e.g., "index"
        # @return [Hash, nil] Complete view config or nil if not found
        def view_config(namespace, feature, view_name)
          view_class = find_view(namespace, feature, view_name)
          return nil unless view_class&.respond_to?(:has_view?) && view_class.has_view?

          # Get raw config from view (layout, translations, drawers - no URL/API)
          config = view_class.view_config_raw

          # Inject URL from Registry (single source of truth)
          config[:url] = "#{API_PREFIX}/#{namespace}/#{feature}"

          # Inject API from tools in same feature
          config[:api] = derive_api_for_feature(namespace, feature)

          # Restructure translations: { global: from_i18n, views: from_view_dsl }
          config[:translations] = {
            global: global_translations,
            views: config[:translations]
          }

          config
        end

        # Derive API registry from tools in a feature
        # @param namespace [String, Symbol]
        # @param feature [String, Symbol]
        # @return [Hash] API registry { action => { method:, path: } }
        def derive_api_for_feature(namespace, feature)
          feature_config = find(namespace, feature)
          return {} unless feature_config

          api = {}
          feature_config[:tools].each do |tool_class|
            next unless tool_class.respond_to?(:route_config) && tool_class.route_config

            route = tool_class.route_config
            tool_name = tool_class.name&.demodulize&.underscore&.to_sym
            next unless tool_name

            # Build path from scope and action
            path = route[:scope] == :member ? ":id" : ""
            if route[:action]
              path = path.empty? ? route[:action].to_s : "#{path}/#{route[:action]}"
            end

            api[tool_name] = {
              method: route[:method].to_s.upcase,
              path:
            }
          end

          api
        end

        # Returns all routable views for frontend routing
        def frontend_routes
          routes = []

          all.each do |namespace, features|
            features.each do |feature_name, config|
              config[:views].each do |view_class|
                # Only include routable views (with frontend_route) or index views (default)
                view_name = view_class.name.demodulize.underscore

                # Determine frontend path
                path = if view_class.respond_to?(:frontend_route) && view_class.frontend_route
                  # Custom path specified
                  view_class.frontend_route
                elsif view_name == "index"
                  # Default: /feature-name for index views
                  "/#{feature_name.to_s.tr('_', '-')}"
                else
                  # Non-index views without frontend_route are not routable
                  next
                end

                routes << {
                  path:,
                  namespace: namespace.to_s,
                  feature: feature_name.to_s,
                  view: view_name
                }
              end
            end
          end

          routes
        end

        # Export for frontend mocks
        def to_mock_data
          all.map do |namespace, features|
            {
              namespace:,
              features: features.map do |slug, config|
                {
                  slug:,
                  schema: config[:schema],
                  tools: config[:tools].map do |tool|
                    {
                      class: tool.name,
                      route: tool.route_config
                    }
                  end,
                  views: config[:views].map { |v| view_slug(v) }
                }
              end
            }
          end
        end

        private

          def view_slug(view_class)
            view_class.name.demodulize.underscore
          end

          def global_translations
            result = {}
            I18n.available_locales.each do |locale|
              result[locale] = I18n.t("ui", locale: locale, default: {})
            end
            result
          end
      end
    end
  end
end
