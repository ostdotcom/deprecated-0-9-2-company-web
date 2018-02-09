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
        request.cookies
    ).fetch_verify_cookie_details

    # success means user is already logged in, we would redirect to dashboard / planner
    @presenter_obj = ::WebPresenter::UserPresenter.new(@response, params)

    # Error means user ain't logged in yet.
    return unless @response.success?

    if @presenter_obj.client_token.step_three_done?
      redirect_to :dashboard, status: GlobalConstant::ErrorCode.temporary_redirect and return
    else
      redirect_to :planner, status: GlobalConstant::ErrorCode.temporary_redirect and return
    end

  end

end
