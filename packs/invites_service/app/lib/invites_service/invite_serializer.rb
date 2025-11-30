# frozen_string_literal: true

module InvitesService
  class InviteSerializer
    include Alba::Resource

    attributes :id, :inviter_id, :invitee_id, :recipient_workspace_id, :status, :auth_link_hash

    attribute :created_at do |invite|
      invite.created_at&.iso8601
    end

    attribute :updated_at do |invite|
      invite.updated_at&.iso8601
    end

    attribute :item_ids do |invite|
      invite.invite_items.pluck(:item_id)
    end
  end
end
