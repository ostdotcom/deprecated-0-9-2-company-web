require_relative 'boot'

require "rails"
# Pick the frameworks you want:
#require "active_model/railtie"
#require "active_job/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
#require "action_cable/engine"
#require "sprockets/railtie"
#require "rails/test_unit/railtie"
require 'active_support/concern'

ost_rails_root = File.expand_path('../..', __FILE__)
require "#{ost_rails_root}/lib/global_constant/base.rb"
Dir["#{ost_rails_root}/lib/global_constant/*.rb"].each {|file| require file }

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CompanyWeb
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Local machine timezone
    config.time_zone = YAML.load_file(open(Rails.root.to_s + '/config/time_zone.yml'))['rails_time_zones'][Rails.env.to_s]
    # Local machine timezone
    # config.active_record.default_timezone = :local

    config.assets.prefix = "/js-css/common"

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths << "#{config.root}/lib/"
    config.eager_load_paths << "#{config.root}/lib/"

  end
end
