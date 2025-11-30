# frozen_string_literal: true

module Core
  # Syncs Registry data to database records (schemas, features, tools, views)
  # Source of truth: Registry -> DB is one-way sync
  class Sync
    class << self
      def call(silent: false)
        @silent = silent
        sync_schemas
        sync_features
        log "Sync complete"
      end

      private

        def sync_schemas
          Schema::Registry.all.each do |schema_class|
            slug = schema_class.slug

            schema_record = ::Schema.find_or_initialize_by(identifier: slug)
            schema_record.workspace_id = nil
            schema_record.data = schema_class.new.to_json_schema
            schema_record.save!

            log "Synced schema: #{slug}"
          end
        end

        def sync_features
          Features::Registry.all.each do |namespace, namespace_features|
            namespace_features.each do |slug, feature_data|
              feature = find_or_create_feature(slug, feature_data, namespace)
              sync_tools(feature, feature_data[:tools], feature_data[:schema])
              sync_views(feature, feature_data[:views])
            end
          end
        end

        def find_or_create_feature(slug, feature_data, namespace)
          identifier = slug.to_s
          feature = ::Feature.find_by(identifier:)
          return feature if feature

          # namespace is for routing (workspaces vs system), type is for feature categorization
          feature_type = namespace == :system ? "system" : nil

          schema_class = resolve_schema(feature_data[:schema])
          schema_metadata = schema_class ? { "json_schema" => schema_class.new.to_json_schema } : {}

          ::Feature.create!(
            title: identifier.titleize,
            identifier:,
            feature_type:,
            config: { "schema" => schema_metadata, "namespace" => namespace.to_s }
          )
        end

        def resolve_schema(schema)
          return nil if schema.nil?
          return schema if schema.is_a?(Class)

          # If it's a symbol/string, look it up from the registry
          Schema::Registry.find(schema)
        end

        def sync_tools(feature, tools, schema_ref)
          tools.each do |tool_class|
            tool_slug = tool_class.name.demodulize.underscore

            existing = ::FeatureTool.find_by(slug: tool_slug, feature_id: feature.id)
            next if existing

            schema_class = resolve_schema(schema_ref)
            schema_slug = schema_class&.slug
            schema_record = schema_slug ? ::Schema.find_by(identifier: schema_slug) : nil

            ::FeatureTool.create!(
              feature_id: feature.id,
              schema_id: schema_record&.id,
              title: tool_slug.titleize,
              slug: tool_slug,
              tool_type: nil,
              description: tool_class.respond_to?(:description) ? tool_class.description : nil,
              config: extract_tool_config(tool_class)
            )

            log "Synced tool: #{feature.identifier}/#{tool_slug}"
          end
        end

        def sync_views(feature, views)
          # Get namespace from feature config
          namespace = feature.config.dig("namespace")&.to_sym || :workspaces

          views.each do |view_class|
            view_slug = view_class.name.demodulize.underscore

            existing = ::FeatureView.find_by(slug: view_slug, feature_id: feature.id)
            next if existing

            # Use Registry.view_config for complete config with derived URL/API
            view_config = if view_class.respond_to?(:has_view?) && view_class.has_view?
              Core::Features::Registry.view_config(namespace, feature.identifier.to_sym, view_slug)
            else
              nil
            end

            ::FeatureView.create!(
              feature_id: feature.id,
              title: view_slug.titleize,
              slug: view_slug,
              config: view_config
            )

            log "Synced view: #{feature.identifier}/#{view_slug}"
          end
        end

        def extract_tool_config(tool_class)
          return nil unless tool_class.respond_to?(:route_config)

          { "route" => tool_class.route_config }
        end

        def log(message)
          puts message unless @silent
        end
    end
  end
end
