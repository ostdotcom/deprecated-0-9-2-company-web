Rails.application.routes.draw do

  scope '', controller: 'web/home' do
    get '/' => :index
  end

  scope '', controller: 'web/user' do
    get '/login' => :login, as: 'login'
    get '/logout' => :logout
    get '/sign-up' => :sign_up
    get '/reset-password' => :reset_password
    get '/update-password' => :update_password
  end

  scope '', controller: 'web/economy' do
    get '/dashboard' => :dashboard, as: 'dashboard'
    get '/planner' => :planner, as: 'planner'
    get '/token-supply' => :token_supply
    get '/users' => :users
    get '/transactions' => :transactions
    get '/simulator' => :simulator
    get '/token-design' => :token_design
  end

  # Route not found handler. Should be the last entry here
  match '*permalink', to: 'application#not_found', via: :all

end