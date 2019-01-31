class Web::UserController < Web::BaseController

  layout "user"

  before_action :check_if_client_is_supported
  before_action :set_page_meta_info

  before_action :dont_render_if_logged_in, only: [
    :reset_password, :update_password
  ]

  before_action :dont_render_if_logged_out, only: [
    :mfa
  ]

  after_action :remove_browser_caching

  def sign_up

    # If cookie is present, log out without bothering about the response.
    if @is_user_logged_in

      CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
      ).logout({})

    end

    if params[:i_t].present?

      unless Util::CommonValidator.is_valid_token?(params[:i_t])
        render 'web/user/invalid_token'
        return
      end

      @response = CompanyApi::Request::Manager.new(
          CompanyApi::Response::Formatter::Manager,
          request.cookies,
          {"User-Agent" => http_user_agent}
      ).get_sign_up_page_details({i_t: params[:i_t]})

      unless @response.success?
        if @response.error_data.present?
          render 'web/user/invalid_token'
        else
          render_error_response(@response)
        end
        return
      end

      @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)

      render "sign_up_via_invite", :locals => {:invite_token => params[:i_t]}

    else

      render "sign_up_without_invite"

    end

  end

  def mfa

    @response = CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).get_setup_mfa_details({})

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)

    render 'mfa'

  end

  def login

    return unless @is_user_logged_in

    # Call logout with bothering about response
    CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).logout({})

  end

  def logout

    # If user was already logged out, redirect to login
    unless @is_user_logged_in
      redirect_to :login and return
    end

    # Else trigger log out without bothering about response
    CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).logout({})

    redirect_to :login

  end

  def reset_password

  end

  def update_password

    unless Util::CommonValidator.is_valid_token?(params[:r_t])
      render 'web/user/invalid_token'
      return
    end

  end

  def verify_email

    if params[:r_t].present?

      unless Util::CommonValidator.is_valid_token?(params[:r_t])
        render 'web/user/invalid_token'
        return
      end

      @response = CompanyApi::Request::Manager.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
      ).verify_email(r_t: params[:r_t])

      if @response.success?
        if @response.go_to.present?
          handle_temporary_redirects(@response)
          return
        else
          render 'web/user/verify_email_success' and return
        end
      elsif @response.http_code == GlobalConstant::ErrorCode.unauthorized_access
        redirect_to :login and return
      else
        render 'web/user/invalid_token'
        return
      end
      
    else
     
      @response = CompanyApi::Request::Manager.new(
          CompanyApi::Response::Formatter::Manager,
          request.cookies,
          {"User-Agent" => http_user_agent}
      ).verify_email({})

      if @response.go_to.present? || !@response.success?
        return handle_temporary_redirects(@response)
      end

      @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)

    end
    
  end

  
  
end
