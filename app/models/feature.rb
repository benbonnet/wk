# frozen_string_literal: true

# == Schema Information
#
# Table name: features
#
#  id           :bigint           not null, primary key
#  config       :jsonb
#  deleted_at   :datetime
#  feature_type :string
#  identifier   :string
#  title        :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_features_on_deleted_at  (deleted_at)
#  index_features_on_identifier  (identifier) UNIQUE
#
class Feature < ApplicationRecord
  VALID_TYPES = %w[producer core knowledge system].freeze

  has_many :feature_workspace_users, dependent: :destroy
  has_many :feature_tools, dependent: :destroy
  has_many :feature_views, dependent: :destroy

  validates :title, presence: true
  validates :identifier, uniqueness: true, allow_nil: true
  validates :feature_type, inclusion: { in: VALID_TYPES }, allow_nil: true

  before_validation :generate_identifier, if: -> { title.present? && identifier.blank? }

  scope :active, -> { where(deleted_at: nil) }
  scope :archived, -> { where.not(deleted_at: nil) }

  def archive
    update(deleted_at: Time.current)
  end

  def archived?
    deleted_at.present?
  end

  private

    def generate_identifier
      self.identifier = title.to_s.downcase.strip.gsub(/\s+/, "-").gsub(/[^\w-]/, "").gsub(/-+/, "-")
    end
end
