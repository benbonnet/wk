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
class Item < ApplicationRecord
  include WorkspaceScoped
  include Core::HasRelationships
  include Core::HasSchemaValidation
  include Core::HasNestedAttributes

  belongs_to :created_by, class_name: "User"
  belongs_to :updated_by, class_name: "User", optional: true
  belongs_to :deleted_by, class_name: "User", optional: true
  has_many :item_recipients, dependent: :destroy
  has_many :documents, dependent: :destroy
  has_many :activities, dependent: :destroy

  validates :schema_slug, presence: true
  validates :tool_slug, presence: true
  validates :data, presence: true
  validates :created_by, presence: true

  scope :active, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }
end
