class Api::VotesController < ApplicationController
  before_action :require_login

  def show
    vote = current_user.vote

    if vote
      render json: {
        voted: true,
        candidate_id: vote.candidate_id,
        candidate_name: vote.candidate.name
      }
    else
      render json: { voted: false }
    end
  end

  def create
    if current_user.vote.present?
      render json: { error: "You have already voted." }, status: :forbidden
      return
    end

    candidate = Candidate.find_by(id: params[:candidate_id])

    unless candidate
      render json: { error: "Candidate not found." }, status: :not_found
      return
    end

    vote = Vote.new(user: current_user, candidate: candidate)

    if vote.save
      render json: {
        success: true,
        vote: {
          candidate_id: vote.candidate_id,
          candidate_name: candidate.name
        }
      }, status: :created
    else
      render json: { errors: vote.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def require_login
    unless current_user
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end
end
