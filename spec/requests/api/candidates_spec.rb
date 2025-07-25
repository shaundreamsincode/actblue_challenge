require "rails_helper"

RSpec.describe "Api::Candidates", type: :request do
  describe "GET /api/candidates" do
    let!(:beyonce)         { create(:candidate, name: "Beyoncé") }
    let!(:radiohead)       { create(:candidate, name: "Radiohead") }
    let!(:arctic_monkeys)  { create(:candidate, name: "Arctic Monkeys") }

    let!(:user1) { create(:user) }
    let!(:user2) { create(:user) }
    let!(:user3) { create(:user) }

    before do
      create(:vote, user: user1, candidate: radiohead)
      create(:vote, user: user2, candidate: radiohead)
      create(:vote, user: user3, candidate: beyonce)
    end

    it "returns candidates" do
      get "/api/candidates"

      expect(response.parsed_body).to eq([
        { "id" => beyonce.id, "name" => "Beyoncé", "votes" => 1 },
        { "id" => radiohead.id, "name" => "Radiohead", "votes" => 2 },
        { "id" => arctic_monkeys.id, "name" => "Arctic Monkeys", "votes" => 0 }
      ])
    end
  end

  describe "POST /api/candidates" do
    let!(:current_user) { create(:user) }
    before { sign_in(current_user) }

    context "when the user is not logged in" do
      before { sign_out }

      it "returns 401 unauthorized" do
        post "/api/candidates", params: { name: "Tame Impala" }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when the user has already voted" do
      let!(:candidate) { create(:candidate, name: "Tame Impala") }

      before do
        create(:vote, user: current_user, candidate: candidate)
      end

      it "returns 403 forbidden" do
        post "/api/candidates", params: { name: "Another Candidate" }
        expect(response).to have_http_status(:forbidden)
        expect(response.parsed_body["error"]).to match(/already voted/i)
      end
    end
  end
end
