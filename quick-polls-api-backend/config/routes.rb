Rails.application.routes.draw do
  resources :users, only: [:create, :show] do
    get "/friends", to: "users#friends"
    post "/friends", to: "users#add_friends"
    post "/friends/search", to: "users#search_friends"
    delete "/friends", to: "users#remove_friends"

    resources :polls, only: [:index, :create]
    post "/polls/:question/edit", to: "polls#edit"
    patch "/polls/:question", to: "polls#update"
    delete "/polls/:question", to: "polls#destroy"
    get "/polls/closed", to: "polls#closed"
    post "/polls/:question/close", to: "polls#close"
    post "/polls/vote", to: "polls#vote"
    post "polls/unvote", to: "polls#unvote"
  end
end
