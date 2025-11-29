# frozen_string_literal: true

class AuthController < ApplicationController
  def authenticate
    redirect_post(
      user_auth0_omniauth_authorize_path,
      params: { authenticity_token: form_authenticity_token }
    )
  end

  def auth0
    user = User.from_omniauth!(request.env["omniauth.auth"])
    workspace = user.default_workspace

    user.update_columns(last_login_at: Time.current)
    sign_in(user)
    session[:workspace_id] = workspace.id

    redirect_to(spa_root_path)
  end

  def passthru
    logout if request.method == "GET"
  end

  def failure
    logout if request.method == "GET"
  end

  def logout
    sign_out(current_user) if current_user
    reset_session
    redirect_to(root_path)
  end
end
