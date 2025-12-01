# frozen_string_literal: true

# == Schema Information
#
# Table name: invites
# Database name: primary
#
#  id                     :bigint           not null, primary key
#  auth_link_hash         :string           not null
#  invitee_email          :string
#  invitee_phone          :string
#  source_type            :string
#  status                 :string           default("pending"), not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  invitee_id             :bigint
#  inviter_id             :bigint           not null
#  recipient_workspace_id :bigint
#  source_id              :bigint
#  workspace_id           :bigint           not null
#
# Indexes
#
#  index_invites_on_auth_link_hash             (auth_link_hash) UNIQUE
#  index_invites_on_invitee_email              (invitee_email)
#  index_invites_on_invitee_id                 (invitee_id)
#  index_invites_on_inviter_id                 (inviter_id)
#  index_invites_on_recipient_workspace_id     (recipient_workspace_id)
#  index_invites_on_source_type_and_source_id  (source_type,source_id)
#  index_invites_on_status                     (status)
#  index_invites_on_workspace_id               (workspace_id)
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
  belongs_to :invitee, class_name: "User", optional: true
  belongs_to :recipient_workspace, class_name: "Workspace", optional: true
  belongs_to :source, polymorphic: true, optional: true
  has_many :invite_items, dependent: :destroy
  has_many :items, through: :invite_items

  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :auth_link_hash, presence: true, uniqueness: true
  validates :invitee_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  before_validation :generate_auth_link_hash, on: :create

  # Link invite to user after authentication
  def link_to_user!(user)
    raise "Email mismatch" unless user.email.to_s.downcase.strip == invitee_email.to_s.downcase.strip
    update!(invitee: user)
  end

  private

    def generate_auth_link_hash
      self.auth_link_hash ||= SecureRandom.hex(8).upcase
    end
end
