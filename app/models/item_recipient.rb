# frozen_string_literal: true

class ItemRecipient < ApplicationRecord
  AUTH_STATUSES = %w[level1 level2 level3 level4].freeze

  belongs_to :item
  belongs_to :user

  validates :auth_status, presence: true, inclusion: { in: AUTH_STATUSES }
  validates :item_id, uniqueness: { scope: :user_id }
end
