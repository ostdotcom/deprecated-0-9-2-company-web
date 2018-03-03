class Web::EconomyController < Web::BaseController

  layout "economy"

  before_action :check_if_client_is_supported
  before_action :set_page_meta_info

  # Dashboard where post setup metrics can be seen
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def dashboard

    @response = CompanyApi::Request::Economy.new(
        CompanyApi::Response::Formatter::Economy,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_dashboard_details

    # Check if error present or not?
    unless @response.success?
      render_error_response(@response)
      return
    end

    unless @presenter_obj.client_token.step_three_done?
      redirect_to :planner, status: GlobalConstant::ErrorCode.temporary_redirect
      return
    end

    @presenter_obj = ::WebPresenter::Economy::Planner.new(@response, params)

  end

  # Planner to perform economy setup step one
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def planner

    @response = CompanyApi::Request::Economy.new(
        CompanyApi::Response::Formatter::Economy,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_planner_step_one_details

    # Check if error present or not?
    unless @response.success?
      render_error_response(@response)
      return
    end

    @presenter_obj = ::WebPresenter::Economy::Planner.new(@response, params)

  end

  # Planner to perform economy setup step two
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def planner_step_two

    @response = CompanyApi::Request::Economy.new(
        CompanyApi::Response::Formatter::Economy,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_planner_step_two_details

    # Check if error present or not?
    unless @response.success?
      render_error_response(@response)
      return
    end

    @presenter_obj = ::WebPresenter::Economy::Planner.new(@response, params)

  end

  # Planner to perform economy setup step three
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def planner_step_three

    @response = CompanyApi::Request::Economy.new(
        CompanyApi::Response::Formatter::Economy,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_planner_step_three_details

    # Check if error present or not?
    unless @response.success?
      render_error_response(@response)
      return
    end

    @presenter_obj = ::WebPresenter::Economy::Planner.new(@response, params)

  end

  # Token Supply stats and section to mint more coins
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def token_supply

    @response = CompanyApi::Request::Economy.new(
        CompanyApi::Response::Formatter::Economy,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_supply_details

    # Check if error present or not?
    unless @response.success?
      render_error_response(@response)
      return
    end

    unless @presenter_obj.client_token.step_three_done?
      redirect_to :planner, status: GlobalConstant::ErrorCode.temporary_redirect
      return
    end

    @presenter_obj = ::WebPresenter::Economy::TokenSupply.new(@response, params)

  end

  # manage users
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def users

    @response = CompanyApi::Request::Economy.new(
        CompanyApi::Response::Formatter::Economy,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_user_details

    # Check if error present or not?
    unless @response.success?
      render_error_response(@response)
      return
    end

    unless @presenter_obj.client_token.step_three_done?
      redirect_to :planner, status: GlobalConstant::ErrorCode.temporary_redirect
      return
    end

    @presenter_obj = ::WebPresenter::Economy::User.new(@response, params)

  end

  # manage transaction types
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def transactions

    @response = CompanyApi::Request::Economy.new(
        CompanyApi::Response::Formatter::Economy,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_transaction_kinds_details

    # Check if error present or not?
    unless @response.success?
      render_error_response(@response)
      return
    end

    unless @presenter_obj.client_token.step_three_done?
      redirect_to :planner, status: GlobalConstant::ErrorCode.temporary_redirect
      return
    end

    @presenter_obj = ::WebPresenter::Economy::Planner.new(@response, params)

  end

  # Simulator to run a transaction & render list of executed transactions
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def simulator

    #TODO: Change this when we know what is to be shown on this page

    @response = CompanyApi::Request::Economy.new(
        CompanyApi::Response::Formatter::Economy,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_transaction_kinds_details

    # Check if error present or not?
    unless @response.success?
      render_error_response(@response)
      return
    end

    unless @presenter_obj.client_token.step_three_done?
      redirect_to :planner, status: GlobalConstant::ErrorCode.temporary_redirect
      return
    end

    @presenter_obj = ::WebPresenter::Economy::Planner.new(@response, params)

  end

  # token design
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def token_design

    #TODO: Change this when we know what is to be shown on this page

    @response = CompanyApi::Request::Economy.new(
        CompanyApi::Response::Formatter::Economy,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_transaction_kinds_details

    # Check if error present or not?
    unless @response.success?
      render_error_response(@response)
      return
    end

    unless @presenter_obj.client_token.step_three_done?
      redirect_to :planner, status: GlobalConstant::ErrorCode.temporary_redirect
      return
    end

    @presenter_obj = ::WebPresenter::Economy::Planner.new(@response, params)

  end

end
