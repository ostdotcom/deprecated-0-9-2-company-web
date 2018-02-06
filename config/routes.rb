Rails.application.routes.draw do

  scope '', controller: 'web/home' do
    get '/' => :index
  end

  scope '', controller: 'web/user' do
    get '/login' => :login
    get '/logout' => :logout
    get '/sign-up' => :sign_up
  end

  scope '', controller: 'web/economy' do
    get '/dashboard' => :dashboard
    get '/planner' => :planner
    get '/token-supply' => :token_supply
    get '/users' => :users
    get '/transactions' => :transactions
    get '/simulator' => :simulator
    get '/token-design' => :token_design
  end

  # Route not found handler. Should be the last entry here
  match '*permalink', to: 'application#not_found', via: :all

end