Rails.application.routes.draw do

  scope '', controller: 'web/home' do
    get '/' => :index
  end

  scope '', controller: 'web/user' do
    get '/login' => :login
    get '/logout' => :logout
    get '/sign-up' => :sign_up
    get '/dashboard' => :dashboard
    get '/planner' => :planner
  end

  # Route not found handler. Should be the last entry here
  match '*permalink', to: 'application#not_found', via: :all

end