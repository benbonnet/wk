# frozen_string_literal: true

class InviteItem < ApplicationRecord
  belongs_to :invite
  belongs_to :item

  validates :invite_id, uniqueness: { scope: :item_id }
end
