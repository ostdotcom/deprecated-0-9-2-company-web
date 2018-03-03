class Web::UserController < Web::BaseController

  layout "user"

  before_action :check_if_client_is_supported
  before_action :set_page_meta_info

  before_action :verify_existing_login, only: [:login, :sign_up, :reset_password, :update_password]

  after_action :remove_browser_caching

  def login

  end

  def logout

    @response = CompanyApi::Request::Client.new(
        CompanyApi::Response::Formatter::Client,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).logout(authenticity_token: form_authenticity_token)

    if @response.success?
      redirect_to :login and return
    else
      render_error_response(@response) and return
    end

  end

  def sign_up

  end

  def reset_password

  end

  def update_password

  end

  def verify_email

    @response = CompanyApi::Request::Client.new(
        CompanyApi::Response::Formatter::Client,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).verify_email(r_t: params[:r_t])

    if @response.success?
      @presenter_obj = ::WebPresenter::UserPresenter.new(@response, params)
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

    # render page displaying error messages

  end

  private

  # Verify existing login
  # Redirect to dashboard / planner if yes
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def verify_existing_login
    return if cookies[GlobalConstant::Cookie.user_cookie_name.to_sym].blank?

    @response = CompanyApi::Request::Client.new(
        CompanyApi::Response::Formatter::Client,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_verify_cookie_details

    # success means user is already logged in, we would redirect to dashboard / planner
    # Error means user ain't logged in yet.
    return unless @response.success?

    @presenter_obj = ::WebPresenter::UserPresenter.new(@response, params)

    if @presenter_obj.client_token.step_three_done?
      redirect_to :dashboard, status: GlobalConstant::ErrorCode.temporary_redirect and return
    else
      redirect_to :planner, status: GlobalConstant::ErrorCode.temporary_redirect and return
    end

  end

end
