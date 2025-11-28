Rails.application.routes.draw do
  # Devise with Auth0
  devise_for :users, controllers: {
    omniauth_callbacks: "users/omniauth_callbacks"
  }

  # Custom logout that also logs out of Auth0
  delete "/logout", to: "sessions#destroy", as: :logout

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api do
    namespace :v1 do
      resource :me, only: [:show], controller: "me"
    end
  end

  # SPA routes (authenticated)
  get "/app", to: "spa#index", as: :spa_root
  get "/app/*path", to: "spa#index"

  # Root - standard Rails landing
  root "home#index"
end
