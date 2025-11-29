# frozen_string_literal: true

class Invite < ApplicationRecord
  include WorkspaceScoped

  STATUSES = %w[pending sent opened clicked confirmed cancelled].freeze

  belongs_to :inviter, class_name: "User"
  belongs_to :invitee, class_name: "User"
  belongs_to :recipient_workspace, class_name: "Workspace", optional: true
  has_many :invite_items, dependent: :destroy
  has_many :items, through: :invite_items

  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :auth_link_hash, presence: true, uniqueness: true

  before_validation :generate_auth_link_hash, on: :create

  private

    def generate_auth_link_hash
      self.auth_link_hash ||= SecureRandom.hex(8).upcase
    end
end
