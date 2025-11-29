# frozen_string_literal: true

# Dynamic resource routing - catches all feature endpoints
# Pattern: /api/v1/:namespace/:feature[/:id][/:action_name]

namespace :core, path: "api" do
  namespace :v1 do
    scope ":namespace" do
      # Collection routes
      get    ":feature",              to: "resources#index"
      post   ":feature",              to: "resources#create"
      get    ":feature/:action_name", to: "resources#collection_action",
                                      constraints: { action_name: /[a-z_]+/ }
      post   ":feature/:action_name", to: "resources#collection_action",
                                      constraints: { action_name: /[a-z_]+/ }

      # Member routes
      get    ":feature/:id",              to: "resources#show"
      put    ":feature/:id",              to: "resources#update"
      patch  ":feature/:id",              to: "resources#update"
      delete ":feature/:id",              to: "resources#destroy"
      get    ":feature/:id/:action_name", to: "resources#member_action",
                                          constraints: { action_name: /[a-z_]+/ }
      post   ":feature/:id/:action_name", to: "resources#member_action",
                                          constraints: { action_name: /[a-z_]+/ }
      put    ":feature/:id/:action_name", to: "resources#member_action",
                                          constraints: { action_name: /[a-z_]+/ }
      delete ":feature/:id/:action_name", to: "resources#member_action",
                                          constraints: { action_name: /[a-z_]+/ }
    end
  end
end
