# frozen_string_literal: true

FactoryBot.define do
  factory :invite do
    inviter { association(:user) }
    invitee { association(:user) }
    status { "pending" }
  end
end
