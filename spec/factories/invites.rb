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
FactoryBot.define do
  factory :invite do
    workspace
    inviter { association(:user) }
    invitee { nil }
    sequence(:invitee_email) { |n| "invitee#{n}@example.com" }
    status { "pending" }

    trait :with_invitee do
      invitee { association(:user) }
      invitee_email { invitee.email }
    end

    trait :with_source_item do
      source { association(:item, schema_slug: "contact") }
    end
  end
end
