# frozen_string_literal: true

# == Schema Information
#
# Table name: invites
#
#  id                     :bigint           not null, primary key
#  auth_link_hash         :string           not null
#  status                 :string           default("pending"), not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  invitee_id             :bigint           not null
#  inviter_id             :bigint           not null
#  recipient_workspace_id :bigint
#  workspace_id           :bigint           not null
#
# Indexes
#
#  index_invites_on_auth_link_hash          (auth_link_hash) UNIQUE
#  index_invites_on_invitee_id              (invitee_id)
#  index_invites_on_inviter_id              (inviter_id)
#  index_invites_on_recipient_workspace_id  (recipient_workspace_id)
#  index_invites_on_status                  (status)
#  index_invites_on_workspace_id            (workspace_id)
#
# Foreign Keys
#
#  fk_rails_...  (invitee_id => users.id)
#  fk_rails_...  (inviter_id => users.id)
#  fk_rails_...  (recipient_workspace_id => workspaces.id)
#  fk_rails_...  (workspace_id => workspaces.id)
#
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
