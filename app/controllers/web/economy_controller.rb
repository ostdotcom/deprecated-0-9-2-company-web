class Web::EconomyController < Web::BaseController

  layout "web"

  before_action :set_page_meta_info

  # Dashboard where post setup metrics can be seen
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def dashboard

  end

  # Planner to perform economy setup steps
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
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

  # Token Supply stats and section to mint more coins
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def token_supply

  end

  # manage users
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def users

  end

  # manage transaction types
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def transactions

  end

  # Simulator to run a transaction & render list of executed transactions
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def simulator

  end

  # token design
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def token_design

  end

end
