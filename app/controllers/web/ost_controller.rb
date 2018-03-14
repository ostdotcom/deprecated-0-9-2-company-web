class Web::OstController < Web::BaseController

  layout "ost"

  skip_before_action :basic_auth

  before_action :handle_simple_token_redirect
  before_action :set_page_meta_info

  def index

  end

  private

  # basic auth
  #
  # * Author: Puneet
  # * Date: 03/03/2018
  # * Reviewed By:
  #
  def handle_simple_token_redirect

    return if GlobalConstant::Base.is_public_launch_done?

    return if params['open_new_website'] == 1

    redirect_to "#{GlobalConstant::CompanyOtherProductUrls.simple_token_url}#{request.fullpath}", status: GlobalConstant::ErrorCode.temporary_redirect and return

  end

end
