# frozen_string_literal: true

module Core
  module V1
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
            scope:,
            action:
          )

          head :not_found unless @tool_class
        end

        def execute_tool
          result = @tool_class.execute(
            user_id: current_user.id,
            workspace_id: current_workspace.id,
            **tool_params
          )
          render json: result
        rescue Core::Tools::ValidationError => e
          render json: { error: e.message, details: e.details }, status: :unprocessable_content
        rescue ActiveRecord::RecordInvalid => e
          render json: { error: "Validation failed", details: validation_errors(e.record) }, status: :unprocessable_content
        rescue Core::Tools::NotFoundError => e
          render json: { error: e.message }, status: :not_found
        rescue Core::Tools::ForbiddenError => e
          render json: { error: e.message }, status: :forbidden
        rescue StandardError => e
          render json: { error: e.class.name, message: e.message }, status: :internal_server_error
        end

        def validation_errors(record)
          record.errors.to_hash(full_messages: false)
        end

        def tool_params
          permitted = Tools::RailsParameters.permit_structure(@tool_class)
          params.permit(*permitted).to_h.deep_symbolize_keys
        end
    end
  end
end
