Rails.application.routes.draw do
  # Swagger UI (development only)
  if Rails.env.development?
    mount Rswag::Ui::Engine => "/api-docs"
    mount Rswag::Api::Engine => "/api-docs"
  end

  devise_for(:users, module: :devise, controllers: { omniauth_callbacks: "auth" })

  devise_scope(:user) do
    get(:logout, to: "auth#logout")
    get(:authenticate, to: "auth#authenticate")
  end

  # Health check
  get "up" => "rails/health#show", :as => :rails_health_check

  # API routes
  namespace :api do
    namespace :v1 do
      resource :account, only: [ :show ], controller: "account"
    end
  end


  # Load pack routes
  draw(:core)
  draw(:invites_service)

  # SPA routes (authenticated)
  get "/app", to: "spa#index", as: :spa_root
  get "/app/*path", to: "spa#index"

  # Root - standard Rails landing
  root "home#index"
end
