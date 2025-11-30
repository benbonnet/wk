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
          class_name = [
            params[:namespace].camelize,
            params[:feature].camelize,
            "Views",
            params[:view_name].camelize
          ].join("::")

          class_name.constantize
        rescue NameError
          nil
        end
    end
  end
end
