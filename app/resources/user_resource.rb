# frozen_string_literal: true

class UserResource < ApplicationResource
  root_key :user

  attributes :id, :login, :name, :email, :avatar_url, :internal
end
