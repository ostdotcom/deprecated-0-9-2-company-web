class Web::HomeController < Web::BaseController

  layout :resolve_layout

  before_action :set_page_meta_info

  def index
    if Rails.env.production? && GlobalConstant::Base.main_sub_environment?
      redirect_to :sign_up_without_invite, status: GlobalConstant::ErrorCode.temporary_redirect and return
    end
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
