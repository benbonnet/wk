# frozen_string_literal: true

module Auth
  module Authentication
    extend ActiveSupport::Concern

    included do
      helper_method :current_user, :current_workspace if respond_to?(:helper_method)
    end

    # Authentication helper - returns current user from session or JWT
    def current_user
      @current_user ||= begin
        # JWT auth
        if (bearer_token = extract_bearer_token)
          payload = Auth::JwtService.decode(bearer_token)
          if payload
            user = User.find_by(id: payload["user_id"])
            @current_workspace_id = payload["workspace_id"] if user
            user
          end
        # Session auth
        elsif session["user_id"]
          User.find_by(id: session["user_id"])
        end
      end
    end

    # Returns the current workspace
    def current_workspace
      @current_workspace ||= begin
        # JWT auth - already extracted in current_user
        if @current_workspace_id
          Workspace.find_by(id: @current_workspace_id)
        # Session auth
        elsif session["workspace_id"]
          Workspace.find_by(id: session["workspace_id"])
        end
      end
    end

    # Extract Bearer token from Authorization header
    def extract_bearer_token
      auth = request.env["HTTP_AUTHORIZATION"]
      auth&.match(/^Bearer (.+)$/)&.[](1)
    end

    # Authentication filter - halts request if user is not authenticated
    def authenticate_user!
      unless current_user
        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    end

    # Authorization filter - halts request if workspace is not set
    def require_workspace!
      unless current_workspace
        render json: { error: "Workspace required" }, status: :forbidden
      end
    end
  end
end
