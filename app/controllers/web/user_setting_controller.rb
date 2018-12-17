class Web::UserSettingController < Web::BaseController

  layout "user_setting"

  before_action :check_if_client_is_supported
  before_action :set_page_meta_info

  after_action :remove_browser_caching

  def team

  end


end
