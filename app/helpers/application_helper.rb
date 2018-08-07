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

  def ost_release_text
    "OST Alpha"
  end

  def ost_valuechain_text
    if(Rails.env.production? && GlobalConstant::Base.main_sub_environment?)
      'Main Ethereum Network'
    else
      'Ropsten Test Network'
    end
  end

end