class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :set_request_from_bot_flag

  # Sanitize params
  include Sanitizer
  before_action :sanitize_params
  after_action :handle_whitelisted_api_cookies

  include CookieConcern
  include ApplicationHelper

  # Page not found action
  #
  def not_found
    res = {
      error: 'ost_page_not_found',
      error_display_text: 'Page not found',
      http_code: GlobalConstant::ErrorCode.not_found
    }
    @response = Result::Base.error(res)
    render_error_response_for(@response)
  end

  # ELB Health Checker
  #
  def health_checker
    render plain: '', :status => 200, :content_type => 'text/html'
  end

  private

  # Get user agent
  #
  def http_user_agent
    request.env['HTTP_USER_AGENT'].to_s
  end

  # set bot request flag in params
  #
  def set_request_from_bot_flag
    res = http_user_agent.match(/\b(Baidu|Baiduspider|Gigabot|Googlebot|thefind|webmeup-crawler.com|libwww-perl|lwp-trivial|msnbot|SiteUptime|Slurp|ZIBB|wget|ia_archiver|ZyBorg|bingbot|AdsBot-Google|AhrefsBot|FatBot|shopstyle|pinterest.com|facebookexternalhit|Twitterbot|crawler.sistrix.net|PolyBot|rogerbot|Pingdom|Mediapartners-Google|bitlybot|BlapBot|Python|www.socialayer.com|Sogou|Scrapy|ShopWiki|Panopta|websitepulse|NewRelicPinger|Sailthru|JoeDog|SocialWire|CCBot|yacybot|Halebot|SNBot|SEOENGWorldBot|SeznamBot|libfetch|QuerySeekerSpider|A6-Indexer|PAYONE|GrapeshotCrawler|curl|ShowyouBot|NING|kraken|MaxPointCrawler|efcrawler|YisouSpider|BingPreview|MJ12bot)\b/i)
    params[:is_bot] = res.present? ? 1 : 0
  end

  # Sanitize params
  #
  def sanitize_params
    sanitize_params_recursively(params)
  end


  # Handle API specific whitelisted cookies
  #
  # * Author: Aman
  # * Date: 16/02/2018
  # * Reviewed By: Sunil
  #
  def handle_whitelisted_api_cookies
    new_api_cookies = request.cookies[GlobalConstant::Cookie.new_api_cookie_key.to_sym]
    return if new_api_cookies.blank?
    whitelisted_api_cookies = [GlobalConstant::Cookie.user_cookie_name, GlobalConstant::Cookie.last_used_env_cookie_name]
    whitelisted_api_cookies.each do |key|
      whitelisted_cookie = new_api_cookies[key]
      if whitelisted_cookie.present? and whitelisted_cookie.is_a?(Hash)
        cookies[key.to_sym] = whitelisted_cookie
      end
    end
  end


  # Set page meta info
  #
  def set_page_meta_info(custom_extended_data = {})
    service_response = GetPageMetaInfo.new(
      controller: params[:controller],
      action: params[:action],
      request_url: request.url,
      custom_extended_data: custom_extended_data
    ).perform

    unless service_response.success?
      raise 'Incomplete Page Meta.'
    end

    page_extended_data = service_response.data

    @page_meta_data = page_extended_data[:meta]
    @page_assets_data = page_extended_data[:assets]
  end

  # Render error response for
  #
  # * Author: Kedar
  # * Date: 09/10/2017
  # * Reviewed By: Sunil Khedar
  #
  def render_error_response_for(service_response)

    http_code = service_response.http_code

    @page_assets_data = {specific_js_required: 0}

    # Clean critical data
    service_response.data = {}

    if request.xhr?
      (render plain: Oj.dump(service_response.to_json, mode: :compat), status: http_code) and return
    else
      if http_code == GlobalConstant::ErrorCode.unauthorized_access
        redirect_to :login and return
      elsif http_code == GlobalConstant::ErrorCode.temporary_redirect
        handle_temporary_redirects(service_response)
      elsif http_code.to_i == GlobalConstant::ErrorCode.under_maintainence_error
        redirect_to :service_unavailable and return
      else
        response.headers['Content-Type'] = 'text/html'
        render file: "public/#{http_code}.html", layout: false, status: http_code and return
      end
    end

  end

  # Render error response for
  #
  # * Author: Puneet
  # * Date: 19/02/2018
  # * Reviewed By:
  #
  def handle_temporary_redirects(service_response)

    case service_response.go_to['by_screen_name']
      when 'verify_email'
        redirect_to :verify_email and return
      when 'setup_mfa'
        redirect_to :mfa and return
      when 'authenticate_mfa'
        redirect_to :mfa and return
      when 'economy_dashboard'
        redirect_to :dashboard and return
      when 'token_setup'
        redirect_to :token_setup and return
      when 'sandbox_token_setup'
        redirect_to "/#{GlobalConstant::Environment.sandbox_sub_url_prefix}/token/setup" and return
      when 'mainnet_token_setup'
        redirect_to "/#{GlobalConstant::Environment.main_sub_env_url_prefix}/token/setup" and return
      when 'token_deploy'
        redirect_to :token_deploy and return
      when 'token_mint'
        redirect_to :token_mint and return
      when 'token_mint_progress'
        redirect_to :token_mint_progress and return
      when 'service_unavailable'
        redirect_to :service_unavailable and return
      when 'login'
        redirect_to :login and return
      else
        fail "unhandled internal redirect: #{service_response.go_to}"
    end

  end

end
