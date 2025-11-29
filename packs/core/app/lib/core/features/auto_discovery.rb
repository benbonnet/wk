# frozen_string_literal: true

module Core
  module Features
    class AutoDiscovery
      class << self
        def run!
          discover_packs.each do |pack_config|
            register_pack(pack_config)
          end
        end

        private

        def discover_packs
          packs = []

          Dir[Rails.root.join("packs/*/app/lib/*")].each do |pack_lib_path|
            next unless File.directory?(pack_lib_path)

            pack_module_name = File.basename(pack_lib_path).camelize
            pack_module = pack_module_name.safe_constantize
            next unless pack_module

            config = {
              module: pack_module,
              module_name: pack_module_name,
              path: pack_lib_path,
              namespace: derive_namespace(pack_module_name),
              feature: derive_feature(pack_module_name),
              schemas: discover_schemas(pack_lib_path, pack_module_name),
              tools: discover_tools(pack_lib_path, pack_module_name),
              views: discover_views(pack_lib_path, pack_module_name)
            }

            packs << config if config[:schemas].any? || config[:tools].any?
          end

          packs
        end

        def derive_namespace(pack_module_name)
          # ContactsService -> workspaces (default)
          # SystemUsers -> system
          # AdminContacts -> admin
          if pack_module_name.start_with?("System")
            :system
          elsif pack_module_name.start_with?("Admin")
            :admin
          else
            :workspaces
          end
        end

        def derive_feature(pack_module_name)
          # ContactsService -> :contacts
          # SystemUsers -> :users
          # AdminContacts -> :contacts
          name = pack_module_name
            .gsub(/Service$/, "")
            .gsub(/^System/, "")
            .gsub(/^Admin/, "")
          name.underscore.to_sym
        end

        def discover_schemas(pack_lib_path, pack_module_name)
          schemas = []
          Dir[File.join(pack_lib_path, "*_schema.rb")].each do |file|
            class_name = "#{pack_module_name}::#{File.basename(file, '.rb').camelize}"
            klass = class_name.safe_constantize
            schemas << klass if klass && klass < Core::Schema::Base
          end
          schemas
        end

        def discover_tools(pack_lib_path, pack_module_name)
          tools = []
          Dir[File.join(pack_lib_path, "tools", "*.rb")].each do |file|
            class_name = "#{pack_module_name}::Tools::#{File.basename(file, '.rb').camelize}"
            klass = class_name.safe_constantize
            tools << klass if klass && klass < Core::Tools::Base
          end
          tools
        end

        def discover_views(pack_lib_path, pack_module_name)
          views = []
          Dir[File.join(pack_lib_path, "views", "*.rb")].each do |file|
            class_name = "#{pack_module_name}::Views::#{File.basename(file, '.rb').camelize}"
            klass = class_name.safe_constantize
            views << klass if klass && defined?(Ui::Views::BaseView) && klass.include?(Ui::Views::BaseView)
          end
          views
        end

        def register_pack(config)
          # Register schemas
          config[:schemas].each do |schema|
            Core::Schema::Registry.register(schema)
          end

          # Reload relationships after schema registration
          Core::Relationships::Registry.reload! if config[:schemas].any?

          # Register feature if tools or views exist
          return unless config[:tools].any? || config[:views].any?

          # Find primary schema for this feature
          primary_schema = config[:schemas].first&.slug&.to_sym

          Core::Features::Registry.register(
            namespace: config[:namespace],
            feature: config[:feature],
            schema: primary_schema,
            tools: config[:tools],
            views: config[:views]
          )

          Rails.logger.info "[AutoDiscovery] Registered #{config[:module_name]}: " \
                            "#{config[:schemas].size} schemas, " \
                            "#{config[:tools].size} tools, " \
                            "#{config[:views].size} views"
        end
      end
    end
  end
end
