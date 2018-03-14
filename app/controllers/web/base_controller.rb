class Web::BaseController < ApplicationController

  before_action :basic_auth

  private

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

    if browser.tablet? || browser.mobile? || !browser.chrome?
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

    #TODO: Use this condition for Launch Code Push
    # return unless Rails.env.staging?

    return if Rails.env.development?

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

end