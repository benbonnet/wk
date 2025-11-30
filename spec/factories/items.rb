# frozen_string_literal: true

# == Schema Information
#
# Table name: items
#
#  id            :bigint           not null, primary key
#  data          :jsonb            not null
#  deleted_at    :datetime
#  schema_slug   :string           not null
#  tool_slug     :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  created_by_id :bigint           not null
#  deleted_by_id :bigint
#  updated_by_id :bigint
#  workspace_id  :bigint
#
# Indexes
#
#  index_items_on_created_by_id              (created_by_id)
#  index_items_on_deleted_at                 (deleted_at)
#  index_items_on_deleted_by_id              (deleted_by_id)
#  index_items_on_schema_slug                (schema_slug)
#  index_items_on_schema_slug_and_tool_slug  (schema_slug,tool_slug)
#  index_items_on_tool_slug                  (tool_slug)
#  index_items_on_updated_by_id              (updated_by_id)
#  index_items_on_workspace_id               (workspace_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (deleted_by_id => users.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (workspace_id => workspaces.id)
#
FactoryBot.define do
  factory :item do
    workspace
    created_by { association(:user) }
    schema_slug { "contacts" }
    tool_slug { "create" }
    data { { "name" => "Test Item" } }
  end
end
