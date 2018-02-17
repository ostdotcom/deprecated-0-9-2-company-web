class Web::BaseController < ApplicationController

  private

  # Render error response pages
  #
  def render_error_response(service_response)
    # Clean critical data
    service_response.data = {}
    render_error_response_for(service_response)
  end

  # Depending on the current state of client redirect to appropriate page
  #
  # * Author: Puneet
  # * Date: 16/02/2018
  # * Reviewed By:
  #
  def handle_redirection

    if @presenter_obj.client_token.step_three_done?
      redirect_to :dashboard, status: GlobalConstant::ErrorCode.temporary_redirect and return
    elsif @presenter_obj.client_token.step_two_done?
      redirect_to :planner_step_three, status: GlobalConstant::ErrorCode.temporary_redirect and return
    elsif @presenter_obj.client_token.step_one_done?
      redirect_to :planner_step_two, status: GlobalConstant::ErrorCode.temporary_redirect and return
    else
      redirect_to :planner, status: GlobalConstant::ErrorCode.temporary_redirect and return
    end

  end

end