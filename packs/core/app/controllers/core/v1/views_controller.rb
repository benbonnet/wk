# frozen_string_literal: true

module Core
  module V1
    class ViewsController < ApplicationController
      # GET /api/v1/views/:namespace/:feature/:view_name
      def show
        config = Core::Features::Registry.view_config(
          params[:namespace],
          params[:feature],
          params[:view_name]
        )

        if config.nil?
          render json: { error: "View not found" }, status: :not_found
          return
        end

        render json: config
      end
    end
  end
end
