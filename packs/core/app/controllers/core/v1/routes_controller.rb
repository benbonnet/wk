# frozen_string_literal: true

module Core
  module V1
    class RoutesController < ApplicationController
      def index
        render json: { routes: Core::Features::Registry.frontend_routes }
      end
    end
  end
end
