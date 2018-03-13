class Web::HomeController < Web::BaseController

  layout :resolve_layout

  before_action :set_page_meta_info

  def index

  end

  def unsupported_client

  end

  def service_unavailable

  end

  def resolve_layout
    case action_name
    when "unsupported_client"
      "header_only"
    when "service_unavailable"
      "header_only"
    else
      "kit"
    end
  end

end
