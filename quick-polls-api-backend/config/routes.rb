Rails.application.routes.draw do
  resources :users
  resources :users, only: [:create]
  resources :polls, only: [:index, :new, :create, :edit, :update]
  get "/polls/closed", to: "polls#closed"
  get "/polls/check", to: "polls#check"
end
