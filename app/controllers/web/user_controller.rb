class Web::UserController < Web::BaseController

  layout "web"

  before_action :set_page_meta_info

  def login
    @fe_no_nav = true;
  end

  def logout

  end

  def sign_up
    @fe_no_nav = true;
  end

end
