Rails.application.routes.draw do

  constraints(InitOst) do
    scope '', controller: 'web/ost' do
      get '/' => :index
    end
  end

  scope '', controller: 'web/home' do
    get '/' => :index
    get '/unsupported-client' => :unsupported_client
    get '/service-unavailable' => :service_unavailable
  end

  scope '', controller: 'web/user' do
    get '/login' => :login, as: 'login'
    get '/logout' => :logout
    get '/sign-up' => :sign_up
    get '/reset-password' => :reset_password
    get '/update-password' => :update_password
    get '/verify-email' => :verify_email
    get '/mfa' => :mfa
    get '/invalid-token' => :invalid_token
  end

  scope 'settings', controller: 'web/user_setting' do
    get '/team' => :team

    ### TODO: Change action when implement.
    get '/developer' => :team, as: 'developer'
  end

  scope "#{GlobalConstant::Environment.url_prefix}", controller: 'web/economy' do
    get '/token/setup' => :token_setup, as: 'token_setup'
    get '/token/deploy' => :token_deploy, as: 'token_deploy'
    get '/token/mint' => :token_mint, as: 'token_mint'
    get '/token/mint-progress' => :token_mint_progress, as: 'token_mint_progress'
  end

  namespace 'devadmin' do
    # ST Api sidekiq web interface endpoint
    mount ApiSidekiqServer => '/api-sidekiq'
  end

  # Route not found handler. Should be the last entry here
  match '*permalink', to: 'application#not_found', via: :all

end