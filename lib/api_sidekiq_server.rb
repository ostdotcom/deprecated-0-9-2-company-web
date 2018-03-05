require 'sidekiq/web'

class ApiSidekiqServer < Sidekiq::Web

  Sidekiq.configure_server do |config|
    config.redis = {url: GlobalConstant::ApiSidekiq.redis_endpoint, namespace: GlobalConstant::ApiSidekiq.namespace}
  end

  Sidekiq.configure_client do |config|
    config.redis = {url: GlobalConstant::ApiSidekiq.redis_endpoint, namespace: GlobalConstant::ApiSidekiq.namespace}
  end

end

Sidekiq::Web.use(Rack::Auth::Basic) do |user, password|
  user == GlobalConstant::ApiSidekiq.admin_user
  password == GlobalConstant::ApiSidekiq.admin_pw
end