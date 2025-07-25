Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "home#index"

  get "/vote", to: "votes#index"
  get "/results", to: "results#index"

  namespace :api do
    post "/login", to: "sessions#create"
    delete "/logout", to: "sessions#destroy"

    resource :vote, only: [:show, :create]
    resources :candidates, only: [:index, :create]
  end
end
