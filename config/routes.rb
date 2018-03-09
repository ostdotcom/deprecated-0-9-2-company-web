Rails.application.routes.draw do

  constraints(InitOst) do
    scope '', controller: 'web/ost' do
      get '/' => :index
    end
  end

  scope '', controller: 'web/home' do
    get '/' => :index
    get '/unsupported-client' => :unsupported_client
  end

  scope '', controller: 'web/user' do
    get '/login' => :login, as: 'login'
    get '/logout' => :logout
    get '/sign-up' => :sign_up
    get '/reset-password' => :reset_password
    get '/update-password' => :update_password
    get '/verify-email' => :verify_email
  end

  scope '', controller: 'web/economy' do
    get '/dashboard' => :dashboard, as: 'dashboard'
    get '/planner' => :planner
    get '/planner/step-1' => :planner, as: 'planner_step_one'
    get '/planner/step-2' => :planner_step_two, as: 'planner_step_two'
    get '/planner/step-3' => :planner_step_three, as: 'planner_step_three'
    get '/token-supply' => :token_supply
    get '/users' => :users
    get '/transactions' => :transactions
    get '/simulator' => :simulator
    get '/developer-api-console' => :developer_api_console
  end


  namespace 'devadmin' do
    # ST Api sidekiq web interface endpoint
    mount ApiSidekiqServer => '/api-sidekiq'
  end

  # Route not found handler. Should be the last entry here
  match '*permalink', to: 'application#not_found', via: :all

end