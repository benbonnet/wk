# frozen_string_literal: true

module WorkspaceMembersService
  class WorkspaceMemberSerializer
    include Alba::Resource

    attributes :id, :role, :status, :created_at, :updated_at

    attribute :user_id do |workspace_user|
      workspace_user.user_id
    end

    attribute :email do |workspace_user|
      workspace_user.user.email
    end

    attribute :name do |workspace_user|
      workspace_user.user.name
    end

    attribute :login do |workspace_user|
      workspace_user.user.login
    end

    attribute :avatar_url do |workspace_user|
      workspace_user.user.avatar_url
    end

    attribute :invited_at do |workspace_user|
      workspace_user.invited_at&.iso8601
    end
  end
end
