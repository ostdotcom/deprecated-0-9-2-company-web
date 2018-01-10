Rails.application.routes.draw do

  scope '', controller: 'web/home' do
    get '/' => :index
  end
  # Route not found handler. Should be the last entry here
  match '*permalink', to: 'application#not_found', via: :all

end