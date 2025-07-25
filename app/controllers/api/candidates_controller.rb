class Api::CandidatesController < ApplicationController
  before_action :require_login, only: [:create]

  def index
    sort_by = params[:sort_by]
    candidates = Candidate.all.includes(:votes)

    case sort_by
    when "votes"
      candidates = candidates.sort_by { |c| -c.votes.size }
    else
      candidates = candidates.sort_by(&:created_at)
    end

    render json: candidates.map { |c|
      {
        id: c.id,
        name: c.name,
        votes: c.votes.count
      }
    }
  end

  def create
    if current_user.vote.present?
      render json: { error: "You have already voted." }, status: :forbidden
      return
    end

    if Candidate.count >= 10
      render json: { error: "Maximum number of candidates reached." }, status: :forbidden
      return
    end

    name = params[:name].to_s.strip
    existing = Candidate.find_by("LOWER(name) = ?", name.downcase)

    if existing
      vote = Vote.new(user: current_user, candidate: existing)
    else
      candidate = Candidate.new(name: name)
      if candidate.save
        vote = Vote.new(user: current_user, candidate: candidate)
      else
        render json: { errors: candidate.errors.full_messages }, status: :unprocessable_entity
        return
      end
    end

    if vote.save
      render json: {
        success: true,
        candidate_id: vote.candidate_id,
        candidate_name: vote.candidate.name
      }, status: :created
    else
      render json: { errors: vote.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
