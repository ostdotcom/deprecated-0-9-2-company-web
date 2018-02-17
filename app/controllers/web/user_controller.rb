class Web::UserController < Web::BaseController

  layout "user"

  before_action :set_page_meta_info

  before_action :verify_existing_login, only: [:login, :sign_up, :reset_password, :update_password]

  def login

  end

  def logout

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
      handle_redirection
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
