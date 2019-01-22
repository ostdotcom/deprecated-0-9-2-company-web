class Web::OstController < Web::BaseController

  skip_before_action :basic_auth

  before_action :handle_simple_token_redirect

  private

  # basic auth
  #
  # * Author: Puneet
  # * Date: 03/03/2018
  # * Reviewed By:
  #
  def handle_simple_token_redirect

    return if GlobalConstant::Base.is_public_launch_done?

    return if params['onw'].to_i == 1

    # replace first '/' with ''
    path = request.fullpath.sub('/', '')
    redirect_to "#{GlobalConstant::CompanyOtherProductUrls.simple_token_url}#{path}", status: GlobalConstant::ErrorCode.temporary_redirect and return

  end

end
