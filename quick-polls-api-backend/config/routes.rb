Rails.application.routes.draw do
  resources :users, only: [:create, :show] do
    resources :polls, only: [:index, :create, :edit, :update, :destroy]
    get "/polls/closed", to: "polls#closed"
    post "/polls/close", to: "polls#close"
    post "/polls/vote", to: "polls#vote"
    post "polls/unvote", to: "polls#unvote"
  end
end
