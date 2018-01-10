class Web::BaseController < ApplicationController

  private

  # Render error response pages
  #
  def render_error_response(service_response)
    # Clean critical data
    service_response.data = {}
    render_error_response_for(service_response)
  end

end