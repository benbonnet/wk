# frozen_string_literal: true

module Api
  module V1
    class AccountController < ApplicationController
      before_action :authenticate_user!

      def show
        render json: UserResource.new(current_user)
      end
    end
  end
end
