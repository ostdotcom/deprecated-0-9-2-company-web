class Web::HomeController < Web::BaseController

  layout :resolve_layout

  before_action :set_page_meta_info

  def index

  end

  def unsupported_client

  end

  def resolve_layout
    case action_name
    when "unsupported_client"
      "header_only"
    else
      "kit"
    end
  end

end
