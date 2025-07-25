class Api::SessionsController < ApplicationController
  def create
    user = User.find_or_initialize_by(email: params[:email]) 
    user.zip_code = params[:zip_code] if user.new_record?
    user.password = params[:password] if user.new_record?

    if user.save
      session[:user_id] = user.id
      render json: { success: true, user_id: user.id }
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    reset_session
    render json: { success: true }
  end
end
