class Web::EconomyController < Web::BaseController

  layout "web"

  before_action :set_page_meta_info

  def dashboard

  end

  def planner

    @response = CompanyApi::Request::Economy.new(
        CompanyApi::Response::Formatter::Economy,
        request.cookies
    ).fetch_planner_details

    # Check if error present or not?
    unless @response.success?
      render_error_response(@response)
      return
    end

    @presenter_obj = ::WebPresenter::Economy::Planner.new(@response, params)

    if @presenter_obj.client_token.step_three_done?
      redirect_to :dashboard, status: GlobalConstant::ErrorCode.temporary_redirect
      return
    end

  end

end
