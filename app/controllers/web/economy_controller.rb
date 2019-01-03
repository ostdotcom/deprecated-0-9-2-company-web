class Web::EconomyController < Web::BaseController

  layout "economy"

  before_action :check_if_client_is_supported
  before_action :set_page_meta_info

  after_action :remove_browser_caching

  # Planner to perform economy setup step one
  #
  # * Author: Ankit
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def planner
    @response = CompanyApi::Request::Token.new(
      CompanyApi::Response::Formatter::Token,
      request.cookies,
      {"User-Agent" => http_user_agent}
    ).fetch_token_details()

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::TokenPresenter.new(@response, params)

    #TODO: Change this temp code
    render 'planner_new'

  end

end
