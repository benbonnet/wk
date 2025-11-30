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
class Schema < ApplicationRecord
  belongs_to :workspace, optional: true
  has_many :feature_tools, dependent: :nullify

  validates :identifier, presence: true, uniqueness: true
  validates :data, presence: true

  scope :active, -> { where(deleted_at: nil) }
  scope :archived, -> { where.not(deleted_at: nil) }

  def archive
    update(deleted_at: Time.current)
  end

  def archived?
    deleted_at.present?
  end
end
