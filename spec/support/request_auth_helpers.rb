module RequestAuthHelpers
  def sign_in(user)
    post "/api/login", params: {
      email: user.email,
      zip_code: user.zip_code,
      password: "irrelevant" # password is ignored in spec logic
    }
  end

  def sign_out
    delete "/api/logout"
  end
end
