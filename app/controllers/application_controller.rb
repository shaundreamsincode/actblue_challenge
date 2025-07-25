class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception

  def require_login
      unless current_user
          render json: { error: "Unauthorized" }, status: :unauthorized
      end
  end

    def current_user
      @current_user ||= User.find_by(id: session[:user_id])
    end  
end
