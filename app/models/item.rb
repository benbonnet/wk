# frozen_string_literal: true

class Item < ApplicationRecord
  include WorkspaceScoped
  include Core::HasRelationships
  belongs_to :created_by, class_name: "User"
  belongs_to :updated_by, class_name: "User", optional: true
  belongs_to :deleted_by, class_name: "User", optional: true
  has_many :item_recipients, dependent: :destroy
  has_many :documents, dependent: :destroy
  has_many :activities, dependent: :destroy

  validates :schema_slug, presence: true, format: { with: /\A[a-z0-9\-_]+\z/, message: "must be lowercase alphanumeric with hyphens/underscores" }
  validates :tool_slug, presence: true, format: { with: /\A[a-z0-9\-_]+\z/, message: "must be lowercase alphanumeric with hyphens/underscores" }
  validates :data, presence: true
  validates :created_by, presence: true

  scope :active, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }
end
