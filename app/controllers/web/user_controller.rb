class Web::UserController < Web::BaseController

  layout "user"

  before_action :check_if_client_is_supported
  before_action :set_page_meta_info

  before_action :dont_render_if_logged_in, only: [
    :sign_up, :login, :reset_password, :update_password
  ]

  before_action :dont_render_if_logged_out, only: [
    :verify_email,
    :authenticate_via_mfa,
    :setup_mfa
  ]

  after_action :remove_browser_caching

  def sign_up

    if params[:i_t].present?

      unless Util::CommonValidator.is_valid_token?(params[:i_t])
        #TODO: Render Error response
        @error_data = {
            display_text: 'Invalid Link',
            display_heading: 'Invalid Link'
        }
        render "sign_via_invite" and return
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
    ).get_setup_mfa_details({})

    unless @response.success?
      render_error_response(@response) and return
    end

    @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)

    render 'mfa'

  end

  def authenticate_via_mfa
    render 'mfa'
  end

  def login

    return if cookies[GlobalConstant::Cookie.user_cookie_name.to_sym].blank?

    # call logout with bothering about response
    CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).logout({})

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

    unless Util::CommonValidator.is_valid_token?(params[:r_t])
      #TODO: Render Error response
      @error_data = {
          display_text: 'Invalid Link',
          display_heading: 'Invalid Link'
      }
    end

  end

  def verify_email

    if params[:r_t].present?

      unless Util::CommonValidator.is_valid_token?(params[:r_t])
        @error_data = {
            display_text: 'Invalid Link',
            display_heading: 'Invalid Link'
        }
        return
      end

      @response = CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
      ).verify_email(r_t: params[:r_t])

      if @response.success?
        handle_temporary_redirects(@response)
      elsif @response.http_code == GlobalConstant::ErrorCode.unauthorized_access
        redirect_to :login and return
      else
        @error_data = {
          display_text: 'Invalid Link',
          display_heading: 'Invalid Link'
        }
      end

    else

      @response = CompanyApi::Request::Manager.new(
          CompanyApi::Response::Formatter::Manager,
          request.cookies,
          {"User-Agent" => http_user_agent}
      ).get_manager_details({})

      unless @response.success?
        render_error_response(@response) and return
      end

      @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)

    end

  end

end
