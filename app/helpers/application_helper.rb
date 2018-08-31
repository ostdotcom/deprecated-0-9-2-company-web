module ApplicationHelper

  # does action require a specific css manifest file
  #
  def has_specific_css_manifest_file?
    @page_assets_data.present? ? !(@page_assets_data[:specific_css_required] == 0) : true
  end

  # does action require a specific js manifest file
  #
  def has_specific_js_manifest_file?
    @page_assets_data.present? ? !(@page_assets_data[:specific_js_required] == 0) : true
  end

  # get specific manifest path for css and js
  #
  def specific_manifest_file_path
    "#{get_formatted_controller_name}-#{get_formatted_action_name}"
  end

  # format controller name for specific manifest file path
  #
  def get_formatted_controller_name
    params[:controller]
  end

  # format action name for specific manifest file path
  #
  def get_formatted_action_name
    params[:action].gsub('_','-')
  end

  def ost_currency_symbol
    if(GlobalConstant::Base.main_sub_environment?)
      "OST"
    else
      "OST⍺"
    end
  end

  def ost_valuechain_text
    if(Rails.env.production? && GlobalConstant::Base.main_sub_environment?)
      'Main Ethereum Network'
    else
      'Ropsten Test Network'
    end
  end

  def min_ost_to_proceed_onboard
    if(GlobalConstant::Base.main_sub_environment?)
      100
    else
      1000
    end
  end

  def min_eth_to_proceed_onboard
    if(GlobalConstant::Base.main_sub_environment?)
      0.0015
    else
      0.05
    end
  end

  def assets_domain
    GlobalConstant::Base.main_sub_environment? ? 'mainnetdev.ost.com' : 'dev.ost.com'
  end

end