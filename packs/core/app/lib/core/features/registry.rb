# frozen_string_literal: true

module Core
  module Features
    class Registry
      class << self
        def all
          @all ||= {}
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

        def clear!
          @all = nil
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
      end
    end
  end
end
