# frozen_string_literal: true

# == Schema Information
#
# Table name: item_recipients
#
#  id          :bigint           not null, primary key
#  auth_status :string           default("level1"), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  item_id     :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_item_recipients_on_item_id              (item_id)
#  index_item_recipients_on_item_id_and_user_id  (item_id,user_id) UNIQUE
#  index_item_recipients_on_user_id              (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => items.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :item_recipient do
    item
    user
    auth_status { "level1" }
  end
end
