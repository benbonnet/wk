# frozen_string_literal: true

scope module: :invites_service do
  resources :invites, only: [:show], param: :auth_link_hash
end
