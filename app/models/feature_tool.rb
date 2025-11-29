# frozen_string_literal: true

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
