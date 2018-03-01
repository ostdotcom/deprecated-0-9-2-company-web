class Web::HomeController < Web::BaseController

  layout "header_only"

  before_action :set_page_meta_info

  def index

  end

  def unsupported_client

  end

end
