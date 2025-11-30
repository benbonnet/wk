# frozen_string_literal: true

# == Schema Information
#
# Table name: invite_items
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  invite_id  :bigint           not null
#  item_id    :bigint           not null
#
# Indexes
#
#  index_invite_items_on_invite_id              (invite_id)
#  index_invite_items_on_invite_id_and_item_id  (invite_id,item_id) UNIQUE
#  index_invite_items_on_item_id                (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (invite_id => invites.id)
#  fk_rails_...  (item_id => items.id)
#
FactoryBot.define do
  factory :invite_item do
    invite
    item
  end
end
