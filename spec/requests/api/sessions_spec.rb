require 'rails_helper'

RSpec.describe "Api::Sessions", type: :request do
  describe "POST /api/login" do
    it "logs in existing user" do
      user = create(:user, email: "user@example.com")
      
      post "/api/login", params: { email: "user@example.com", zip_code: "12345" }
      
      expect(response).to have_http_status(:success)
    end

    it "creates new user and logs in" do
      expect {
        post "/api/login", params: {
          email: "new@example.com",
          zip_code: "54321",
          password: "password123"
        }
      }.to change(User, :count).by(1)

      expect(response).to have_http_status(:success)
    end
  end

  describe "DELETE /api/logout" do
    it "logs out user" do
      user = create(:user)
      post "/api/login", params: { email: user.email, zip_code: user.zip_code }
      
      delete "/api/logout"
      expect(response).to have_http_status(:success)
    end
  end
end
