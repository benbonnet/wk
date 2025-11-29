# frozen_string_literal: true

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def auth0
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user
      @user.update_columns(last_login_at: Time.current)
      sign_in_and_redirect @user, event: :authentication
    else
      # User not found - redirect to login or show error
      redirect_to new_user_session_path, alert: "User not found. Please contact support."
    end
  end

  def failure
    redirect_to root_path, alert: "Authentication failed."
  end

  protected

    def after_sign_in_path_for(resource)
      spa_root_path
    end

    def after_sign_out_path_for(resource_or_scope)
      auth0_logout_url
    end

  private

    def auth0_logout_url
      domain = AUTH0_CREDS[:domain]
      client_id = AUTH0_CREDS[:client_id]
      return_to = root_url

      "https://#{domain}/v2/logout?client_id=#{client_id}&returnTo=#{CGI.escape(return_to)}"
    end
end
