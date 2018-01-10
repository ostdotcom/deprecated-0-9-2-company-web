Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  # config.force_ssl = true

  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Disable serving static files from the `/public` folder by default since
  # Apache or NGINX already handles this.
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?

  # Compress JavaScripts and CSS.
  uglifier = Uglifier.new output: { comments: :copyright}
  config.assets.js_compressor = uglifier
  config.assets.css_compressor = :yui

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = false

  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = true

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  config.action_controller.asset_host = "https://#{ENV['OST_CLOUDFRONT_DOMAIN']}/"

  # Incase we want to test asset precompile in development
  config.assets.prefix = "/js-css/stag"

  config.log_level = :debug

  # Prepend all log lines with the following tags.
  config.log_tags = [ :request_id ]

  config.action_mailer.perform_caching = false

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new

  config.action_mailer.delivery_method = :sendmail

  # Exception notification
  config.middleware.use ExceptionNotification::Rack,
                        email: {
                          email_prefix: GlobalConstant::Email.subject_prefix,
                          sender_address: GlobalConstant::Email.default_from,
                          exception_recipients: GlobalConstant::Email.default_to
                        },
                        ignore_exceptions: [
                          'ActionDispatch::RemoteIp::IpSpoofAttackError',
                          'ActionController::InvalidAuthenticityToken'
                        ] + ExceptionNotifier.ignored_exceptions
end
