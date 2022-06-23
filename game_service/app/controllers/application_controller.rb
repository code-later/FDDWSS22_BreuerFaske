class ApplicationController < ActionController::Base
  before_action :authenticate

  private

  def authenticate
    if (auth_cookie = cookies[:_mau_mau_auth_JWT])
      payload, _header = JWT.decode(auth_cookie, Rails.application.config.x.jwt_auth_secret, true)

      return true if (@current_user = payload["email"])
    end

    redirect_to root_url, status: :unauthorized
  rescue JWT::DecodeError
    redirect_to root_url, status: :unauthorized
  end

  def current_user
    @current_user
  end
  helper_method :current_user
end
