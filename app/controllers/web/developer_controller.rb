class Web::DeveloperController < Web::BaseController

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
  def developer
    @response = CompanyApi::Request::Developer.new(
        CompanyApi::Response::Formatter::Token,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).index()

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::TokenPresenter.new(@response, params)

  end

end
