# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  helper_method :current_user, :current_workspace

  # Override Devise's current_user to support JWT
  def current_user
    @current_user ||= user_from_jwt || super
  end

  def current_workspace
    @current_workspace ||= workspace_from_jwt || Workspace.find_by(id: session[:workspace_id])
  end

  protected

    def after_sign_in_path_for(resource)
      spa_root_path
    end

    def after_sign_out_path_for(resource_or_scope)
      root_path
    end

  private

    def jwt_payload
      return @jwt_payload if defined?(@jwt_payload)

      token = request.headers["Authorization"]&.match(/^Bearer (.+)$/)&.[](1)
      @jwt_payload = token ? Auth::JwtService.decode(token) : nil
    end

    def user_from_jwt
      return unless jwt_payload

      @jwt_user ||= User.find_by(id: jwt_payload[:user_id])
    end

    def workspace_from_jwt
      return unless jwt_payload && jwt_payload[:workspace_id]

      @jwt_workspace ||= Workspace.find_by(id: jwt_payload[:workspace_id])
    end
end
