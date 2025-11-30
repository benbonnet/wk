# frozen_string_literal: true

# == Schema Information
#
# Table name: schemas
#
#  id           :bigint           not null, primary key
#  data         :jsonb            not null
#  deleted_at   :datetime
#  identifier   :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  workspace_id :bigint
#
# Indexes
#
#  index_schemas_on_deleted_at    (deleted_at)
#  index_schemas_on_identifier    (identifier) UNIQUE
#  index_schemas_on_workspace_id  (workspace_id)
#
# Foreign Keys
#
#  fk_rails_...  (workspace_id => workspaces.id)
#
FactoryBot.define do
  factory :schema do
    sequence(:identifier) { |n| "schema-#{n}" }
    data { { "type" => "object", "properties" => {} } }
  end
end
