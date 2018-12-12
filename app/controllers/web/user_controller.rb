class Web::UserController < Web::BaseController

  layout "user"

  before_action :check_if_client_is_supported
  before_action :set_page_meta_info

  after_action :remove_browser_caching

  def sign_up

    if params[:i_t].present?

      if Util::CommonValidator.is_valid_token?(params[:i_t])
        #TODO: Render Error response
        return
      end

      @response = CompanyApi::Request::Manager.new(
          CompanyApi::Response::Formatter::Manager,
          request.cookies,
          {"User-Agent" => http_user_agent}
      ).get_sign_up_page_details({})

      unless @response.success?
        render_error_response(@response) and return
      end

      @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)

      render "sign_via_invite"

    else

      render "sign_up_without_invite"

    end

  end

  def setup_mfa

    @response = CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).get_sign_up_page_details({})

    unless @response.success?
      render_error_response(@response) and return
    end

    @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)

  end

  def mfa

  end

  def login

    @response = CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).logout({})

    unless @response.success?
      render_error_response(@response) and return
    end

  end

  def logout

    @response = CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).logout({})

    if @response.success?
      redirect_to :login and return
    else
      render_error_response(@response) and return
    end

  end

  def reset_password

  end

  def update_password

  end

  def verify_email

    if params[:r_t].present?

      if Util::CommonValidator.is_valid_token?(params[:r_t])
        #TODO: Render Error response
        return
      end

      @response = CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
      ).verify_email(r_t: params[:r_t])

      if @response.success?
        @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)
        redirect_to :planner and return
      elsif @response.http_code == GlobalConstant::ErrorCode.unauthorized_access
        redirect_to :login and return
      else
        #TODO: FIx this
        @error_data = {
          display_text: 'Invalid Link',
          display_heading: 'Invalid Link'
        }
      end

    end

  end

  private

end
