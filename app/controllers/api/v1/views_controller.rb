# frozen_string_literal: true

module Api
  module V1
    class ViewsController < ApplicationController
      # GET /api/v1/views/:namespace/:feature/:view_name
      def show
        view_class = find_view_class

        if view_class.nil?
          render json: { error: "View not found" }, status: :not_found
          return
        end

        unless view_class.respond_to?(:view_config)
          render json: { error: "Invalid view class" }, status: :unprocessable_content
          return
        end

        render json: view_class.view_config
      end

      private

        def find_view_class
          Core::Features::Registry.find_view(
            params[:namespace],
            params[:feature],
            params[:view_name]
          )
        end
    end
  end
end
