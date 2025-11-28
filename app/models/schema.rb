# frozen_string_literal: true

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
