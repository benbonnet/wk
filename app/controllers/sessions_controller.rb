# frozen_string_literal: true

class SessionsController < ApplicationController
  def destroy
    sign_out current_user
    redirect_to auth0_logout_url, allow_other_host: true
  end

  private

    def auth0_logout_url
      domain = AUTH0_CREDS[:domain]
      client_id = AUTH0_CREDS[:client_id]
      return_to = root_url

      "https://#{domain}/v2/logout?client_id=#{client_id}&returnTo=#{CGI.escape(return_to)}"
    end
end
