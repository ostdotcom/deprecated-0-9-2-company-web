class Web::BaseController < ApplicationController

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

end