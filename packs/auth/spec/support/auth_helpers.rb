# frozen_string_literal: true

module AuthHelpers
  def auth_headers(user, workspace: nil)
    payload = { user_id: user.id }
    payload[:workspace_id] = workspace.id if workspace
    token = Auth::JwtService.encode(payload)
    { "Authorization" => "Bearer #{token}" }
  end

  def sign_in_user(user)
    allow(controller).to receive(:current_user).and_return(user)
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
  config.include AuthHelpers, type: :controller
end
