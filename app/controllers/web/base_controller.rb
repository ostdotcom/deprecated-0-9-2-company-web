class Web::BaseController < ApplicationController

  before_action :basic_auth
  before_action :is_user_logged_in

  include Util::ResultHelper

  private

  def is_user_logged_in
    @is_user_logged_in = cookies[GlobalConstant::Cookie.user_cookie_name.to_sym].present?
  end

  # Render error response pages
  #
  def render_error_response(service_response)
    # Clean critical data
    service_response.data = {}
    render_error_response_for(service_response)
  end

  # Check if we support a given browser & device combination
  # If not we redirect to a page with 302
  # 1. DO NOT SUPPORT ANY OTHER BROWSER THAN CHROME
  # 2. DO NOT SUPPORT ANY MOBILE OR TABLET DEVICE
  def check_if_client_is_supported

    if browser.tablet? || browser.mobile? || !(browser.chrome? || browser.firefox?)
      redirect_to :unsupported_client, status: GlobalConstant::ErrorCode.temporary_redirect and return
    end

  end

  # basic auth
  #
  # * Author: Puneet
  # * Date: 03/03/2018
  # * Reviewed By:
  #
  def basic_auth

    return if Rails.env.development?

    return if Rails.env.production? && GlobalConstant::Base.is_public_launch_done?

    users = {
      GlobalConstant::BasicAuth.username => GlobalConstant::BasicAuth.password
    }

    authenticate_or_request_with_http_basic do |username, password|
      if users[username].present? && users[username] == password
        true
      else
        false
      end
    end

  end

  # Dont allow browser caching for all GET requests
  #
  # * Author: Puneet
  # * Date: 03/03/2017
  # * Reviewed By:
  #
  def remove_browser_caching
    return unless request.get?
    response.headers['Pragma'] = 'no-cache'
    response.headers['Cache-Control'] = 'no-store, no-cache, max-age=0, must-revalidate, post-check=0, pre-check=0'
    response.headers['Vary'] = '*'
    response.headers['Expires'] = '-1'
    response.headers['Last-Modified'] = "#{Time.now.gmtime.strftime("%a, %d %b %Y %T GMT")}"
  end

  # Verify existing login
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def dont_render_if_logged_in

    return unless @is_user_logged_in

    @response = CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).get_manager_details({})

    if @response.go_to.present? || !@response.success?
      handle_temporary_redirects(@response) and return
    end

  end

  # Verify existing login
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def dont_render_if_logged_out

    return if @is_user_logged_in

    redirect_to :login, status: GlobalConstant::ErrorCode.temporary_redirect and return

  end

end