# frozen_string_literal: true

module InvitesService
  class InviteSchema < Core::Schema::Base
    title "Invite"
    description "An invitation to share items between users"

    string :inviter_id, description: "User sending the invite"
    string :invitee_id, description: "User receiving the invite"
    string :recipient_workspace_id, description: "Target workspace for shared items", required: false
    string :status, description: "Invite status", enum: %w[pending sent opened clicked accepted declined cancelled], required: false
    array :item_ids, of: :string, description: "IDs of items to share", required: false

    timestamps
  end
end
