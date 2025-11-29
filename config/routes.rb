Rails.application.routes.draw do
  # Devise with Auth0
  devise_for :users, controllers: {
    omniauth_callbacks: "users/omniauth_callbacks"
  }

  # Custom logout that also logs out of Auth0
  delete "/logout", to: "sessions#destroy", as: :logout

  # Health check
  get "up" => "rails/health#show", :as => :rails_health_check

  # API routes
  namespace :api do
    namespace :v1 do
      resource :account, only: [ :show ], controller: "account"
      get "views/:namespace/:feature/:view_name", to: "views#show"
    end
  end


  # Load pack routes
  draw(:core)

  # SPA routes (authenticated)
  get "/app", to: "spa#index", as: :spa_root
  get "/app/*path", to: "spa#index"

  # Root - standard Rails landing
  root "home#index"
end
