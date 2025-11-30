# frozen_string_literal: true

module Core
  module Processors
    class NestedAttributesProcessor
      class << self
        def process_create(source_schema:, source_item_id:, data:, workspace_id:, user_id:)
          normalize_data(data).each do |key, value|
            next unless nested_attributes_key?(key) && value.is_a?(Array)

            assoc_name = key.delete_suffix("_attributes")
            rel_config = find_relationship_config(source_schema, assoc_name)
            next unless rel_config

            value.each do |nested_attrs|
              nested_attrs = normalize_data(nested_attrs)
              process_nested_item_create(nested_attrs, rel_config, source_item_id, workspace_id, user_id)
            end
          end
        end

        def process_update(source_schema:, source_item_id:, data:, workspace_id:, user_id:)
          normalize_data(data).each do |key, value|
            next unless nested_attributes_key?(key) && value.is_a?(Array)

            assoc_name = key.delete_suffix("_attributes")
            rel_config = find_relationship_config(source_schema, assoc_name)
            next unless rel_config

            value.each do |nested_attrs|
              nested_attrs = normalize_data(nested_attrs)
              process_nested_item_update(nested_attrs, rel_config, source_item_id, workspace_id, user_id)
            end
          end
        end

        def strip_nested_attributes(data)
          data.to_h.reject { |k, _| nested_attributes_key?(k) }
        end

        private

          def process_nested_item_create(attrs, rel_config, source_item_id, workspace_id, user_id)
            target_id = attrs["id"]

            if target_id
              return unless Item.exists?(id: target_id)
              ensure_relationship(source_item_id, target_id, rel_config)
              process_create(
                source_schema: rel_config[:target_schema],
                source_item_id: target_id,
                data: attrs,
                workspace_id:, user_id:
              )
            else
              nested_item = create_item(rel_config[:target_schema], attrs, workspace_id, user_id)
              ensure_relationship(source_item_id, nested_item.id, rel_config)
              process_create(
                source_schema: rel_config[:target_schema],
                source_item_id: nested_item.id,
                data: attrs,
                workspace_id:, user_id:
              )
            end
          end

          def process_nested_item_update(attrs, rel_config, source_item_id, workspace_id, user_id)
            target_id = attrs["id"]

            if destroy_flag?(attrs)
              destroy_relationship(source_item_id, target_id, rel_config, user_id) if target_id
              return
            end

            if target_id
              ensure_relationship(source_item_id, target_id, rel_config)
              update_item(target_id, attrs, rel_config[:target_schema], workspace_id, user_id)
            else
              nested_item = create_item(rel_config[:target_schema], attrs, workspace_id, user_id)
              ensure_relationship(source_item_id, nested_item.id, rel_config)
              process_create(
                source_schema: rel_config[:target_schema],
                source_item_id: nested_item.id,
                data: attrs,
                workspace_id:, user_id:
              )
            end
          end

          def nested_attributes_key?(key)
            key.to_s.end_with?("_attributes")
          end

          def normalize_data(data)
            return {} unless data.is_a?(Hash)
            data.transform_keys(&:to_s)
          end

          def destroy_flag?(attrs)
            val = attrs["_destroy"]
            val == true || val == "1" || val == "true" || val == 1
          end

          def create_item(schema_slug, attrs, workspace_id, user_id)
            clean_data = strip_nested_attributes(attrs).except("id", "_destroy")
            Item.create!(
              schema_slug:,
              tool_slug: "nested_create",
              data: clean_data,
              workspace_id:,
              created_by_id: user_id,
              updated_by_id: user_id
            )
          end

          def update_item(item_id, attrs, source_schema, workspace_id, user_id)
            item = Item.find_by(id: item_id)
            return unless item

            clean_data = strip_nested_attributes(attrs).except("id", "_destroy")
            item.update!(data: item.data.merge(clean_data), updated_by_id: user_id) if clean_data.present?

            process_update(
              source_schema:,
              source_item_id: item.id,
              data: attrs,
              workspace_id:, user_id:
            )
          end

          def ensure_relationship(source_item_id, target_item_id, rel_config)
            ItemRelationship.find_or_create_by!(
              source_item_id:,
              target_item_id:,
              relationship_type: rel_config[:type]
            )

            return unless rel_config[:inverse_name]
            ItemRelationship.find_or_create_by!(
              source_item_id: target_item_id,
              target_item_id: source_item_id,
              relationship_type: rel_config[:inverse_name].to_s
            )
          end

          def destroy_relationship(source_item_id, target_item_id, rel_config, user_id)
            ItemRelationship.where(
              source_item_id:,
              target_item_id:,
              relationship_type: rel_config[:type]
            ).destroy_all

            if rel_config[:inverse_name]
              ItemRelationship.where(
                source_item_id: target_item_id,
                target_item_id: source_item_id,
                relationship_type: rel_config[:inverse_name].to_s
              ).destroy_all
            else
              Item.find_by(id: target_item_id)&.update!(deleted_at: Time.current, deleted_by_id: user_id)
            end
          end

          def find_relationship_config(source_schema_slug, assoc_name)
            schema_class = Core::Schema::Registry.find(source_schema_slug)
            return nil unless schema_class&.respond_to?(:find_relationship)

            rel_def = schema_class.find_relationship(assoc_name.to_sym)
            return nil unless rel_def

            {
              type: rel_def[:name].to_s,
              target_schema: rel_def[:target_schema].to_s,
              inverse_name: rel_def[:inverse_name]
            }
          end
      end
    end
  end
end
