# frozen_string_literal: true

# == Schema Information
#
# Table name: feature_tools
#
#  id          :bigint           not null, primary key
#  config      :jsonb
#  deleted_at  :datetime
#  description :text
#  slug        :string           not null
#  title       :string           not null
#  tool_type   :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  feature_id  :bigint           not null
#  schema_id   :bigint
#
# Indexes
#
#  index_feature_tools_on_deleted_at           (deleted_at)
#  index_feature_tools_on_feature_id           (feature_id)
#  index_feature_tools_on_schema_id            (schema_id)
#  index_feature_tools_on_slug_and_feature_id  (slug,feature_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (feature_id => features.id)
#  fk_rails_...  (schema_id => schemas.id)
#
class FeatureTool < ApplicationRecord
  VALID_TYPES = %w[producer core knowledge system].freeze

  belongs_to :feature
  belongs_to :schema, optional: true

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: { scope: :feature_id }
  validates :tool_type, inclusion: { in: VALID_TYPES }, allow_nil: true

  before_validation :generate_slug, if: -> { title.present? && slug.blank? }

  scope :active, -> { where(deleted_at: nil) }
  scope :archived, -> { where.not(deleted_at: nil) }

  def archive
    update(deleted_at: Time.current)
  end

  def archived?
    deleted_at.present?
  end

  private

    def generate_slug
      self.slug = title.to_s.downcase.strip.gsub(/\s+/, "-").gsub(/[^\w-]/, "").gsub(/-+/, "-")
    end
end
