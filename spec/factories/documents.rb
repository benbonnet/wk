# frozen_string_literal: true

# == Schema Information
#
# Table name: documents
#
#  id           :bigint           not null, primary key
#  description  :text
#  file_data    :text
#  title        :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  item_id      :bigint
#  user_id      :bigint           not null
#  workspace_id :bigint           not null
#
# Indexes
#
#  index_documents_on_created_at    (created_at)
#  index_documents_on_item_id       (item_id)
#  index_documents_on_user_id       (user_id)
#  index_documents_on_workspace_id  (workspace_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => items.id)
#  fk_rails_...  (user_id => users.id)
#  fk_rails_...  (workspace_id => workspaces.id)
#
FactoryBot.define do
  factory :document do
    title { FFaker::Lorem.sentence }
    user
    workspace
  end
end
