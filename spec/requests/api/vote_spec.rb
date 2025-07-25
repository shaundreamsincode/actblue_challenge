require 'rails_helper'

RSpec.describe "Api::Votes", type: :request do
  let(:user) { create(:user) }
  let(:candidate) { create(:candidate) }

  before do
    sign_in(user)
  end

  describe "GET /api/vote" do
    it "returns voted status" do
      get "/api/vote"
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /api/vote" do
    it "creates a vote" do
      expect {
        post "/api/vote", params: { candidate_id: candidate.id }
      }.to change { Vote.count }.by(1)

      expect(response).to have_http_status(:created)
    end

    it "prevents voting twice" do
      create(:vote, user: user, candidate: candidate)
      
      post "/api/vote", params: { candidate_id: candidate.id }
      expect(response).to have_http_status(:forbidden)
    end
  end
end
