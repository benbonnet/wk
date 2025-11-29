# 12 - Resources Controller

## File: packs/core/app/controllers/core/resources_controller.rb

```ruby
# frozen_string_literal: true

module Core
  class ResourcesController < ApplicationController
    before_action :resolve_feature
    before_action :resolve_tool

    def index
      execute_tool
    end

    def create
      execute_tool
    end

    def show
      execute_tool
    end

    def update
      execute_tool
    end

    def destroy
      execute_tool
    end

    def collection_action
      execute_tool
    end

    def member_action
      execute_tool
    end

    private

    def resolve_feature
      @feature = Features::Registry.find(params[:namespace], params[:feature])
      head :not_found unless @feature
    end

    def resolve_tool
      scope = params[:id].present? ? :member : :collection
      action = params[:action_name]

      @tool_class = Features::Registry.find_tool(
        params[:namespace],
        params[:feature],
        http_method: request.method.downcase.to_sym,
        scope: scope,
        action: action
      )

      head :not_found unless @tool_class
    end

    def execute_tool
      result = @tool_class.call(self, tool_params)
      render json: result
    rescue Core::Tools::ValidationError => e
      render json: { error: e.message, details: e.details }, status: :unprocessable_entity
    rescue Core::Tools::NotFoundError => e
      render json: { error: e.message }, status: :not_found
    rescue Core::Tools::ForbiddenError => e
      render json: { error: e.message }, status: :forbidden
    end

    def tool_params
      params.permit!.to_h.symbolize_keys.except(
        :namespace, :feature, :action_name, :controller, :action, :format
      )
    end
  end
end
```

## Spec: packs/core/spec/controllers/core/resources_controller_spec.rb

```ruby
# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::ResourcesController, type: :controller do
  let(:user) { create(:user) }

  let(:contact_schema) do
    Class.new(Core::Schema::Base) do
      def self.name
        "ContactSchema"
      end
      title "Contact"
    end
  end

  let(:index_tool) do
    Class.new(Core::Tools::Base) do
      route method: :get, scope: :collection
      schema "contact"

      def execute(**params)
        { items: [], params: params }
      end
    end
  end

  let(:show_tool) do
    Class.new(Core::Tools::Base) do
      route method: :get, scope: :member
      schema "contact"

      def execute(id:, **_)
        { id: id }
      end
    end
  end

  let(:error_tool) do
    Class.new(Core::Tools::Base) do
      route method: :post, scope: :collection
      schema "contact"

      def execute(**_)
        raise Core::Tools::ValidationError.new("Invalid", { field: "name" })
      end
    end
  end

  before do
    Core::Schema::Registry.clear!
    Core::Schema::Registry.register(contact_schema)
    Core::Features::Registry.clear!
    Core::Features::Registry.register(
      namespace: :workspaces,
      feature: :contacts,
      tools: [index_tool, show_tool, error_tool]
    )

    sign_in user if respond_to?(:sign_in)
  end

  describe "GET #index" do
    it "executes the index tool" do
      get :index, params: { namespace: "workspaces", feature: "contacts" }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["items"]).to eq([])
    end

    it "passes query params to tool" do
      get :index, params: { namespace: "workspaces", feature: "contacts", page: 2 }
      body = JSON.parse(response.body)
      expect(body["params"]["page"]).to eq("2")
    end
  end

  describe "GET #show" do
    it "executes the show tool with id" do
      get :show, params: { namespace: "workspaces", feature: "contacts", id: 123 }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["id"]).to eq("123")
    end
  end

  describe "unknown feature" do
    it "returns 404" do
      get :index, params: { namespace: "workspaces", feature: "unknown" }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "unknown route" do
    it "returns 404 for unregistered HTTP method" do
      delete :destroy, params: { namespace: "workspaces", feature: "contacts", id: 1 }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "error handling" do
    it "handles ValidationError" do
      post :create, params: { namespace: "workspaces", feature: "contacts" }
      expect(response).to have_http_status(:unprocessable_entity)
      body = JSON.parse(response.body)
      expect(body["error"]).to eq("Invalid")
      expect(body["details"]["field"]).to eq("name")
    end
  end
end
```
