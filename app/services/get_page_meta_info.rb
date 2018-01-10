class GetPageMetaInfo < ServicesBase

  # Initialize
  #
  # @param [String] controller (mandatory) - Controller name
  # @param [String] action (mandatory) - action name
  # @param [Hash] request_url (mandatory) - request url
  # @param [Hash] custom_extended_data (mandatory) - custom extended data
  #
  # @return [GetPageMetaInfo]
  #
  def initialize(params)
    super
    @controller = @params[:controller]
    @action = @params[:action]
    @request_url = @params[:request_url]
    @custom_meta = @params[:custom_extended_data][:meta] || {}
    @custom_meta[:canonical] ||= canonical_url
    @custom_meta[:og_url] ||= canonical_url

    @meta_data = {}
    @assets_data = {}
  end

  # Perform
  #
  # @return [Result::Base]
  #
  def perform
    r = validate
    return r unless r.success?

    construct_page_meta_vars

    set_assets_config

    meta_response
  end

  private

  # Construct page meta variables
  #
  # Set @meta_data
  #
  def construct_page_meta_vars
    # Interpolate and set @meta_data
    raw_meta = get_meta_config
    second_level_keys = []
    raw_meta.each do |k, v|
      if v.is_a?(Hash)
        second_level_keys << k
        next
      end

      if v.is_a?(Array)
        v = @custom_meta[k.to_s]
      else
        v =  v % @custom_meta
      end

      @meta_data[k] = v
    end

    second_level_keys.each do |level2|
      @meta_data[level2] = {}
      raw_meta[level2].each do |k, v|
        if v.is_a?(Array)
          v = @custom_meta["#{level2.to_s}_#{k.to_s}"]
        else
          v =  v % @custom_meta
        end
        @meta_data[level2][k] = v
      end
    end

    safe_guard_meta

  end

  # Set assets config keys
  #
  # Set @assets_data
  #
  def set_assets_config
    @assets_data = get_config[:assets] || {}
  end

  # Meta response
  #
  # @return [Result::Base]
  #
  def meta_response
    success_result(
      {
        meta: @meta_data,
        assets: @assets_data
      }
    )
  end

  # safe guard meta
  #
  # @return [Hash] returns safe guarded meta data for this page
  #
  def safe_guard_meta
    @meta_data[:robots] = 'noindex, nofollow' if !Rails.env.production? && !Rails.env.development?
  end

  # Canonical url without trailing slash for current page
  #
  def canonical_url
    @canonical_url ||= url_without_params.chomp('/')
  end

  # Remove url parameters
  #
  def url_without_params
    @request_url.split('?')[0]
  end

  protected

  # Get action asset config
  #
  # @return [Hash] returns asset config for this page
  #
  def get_assets_config
    get_config[:assets] || {}
  end

  # Get action meta config
  #
  # @return [Hash] returns meta config for this page
  #
  def get_meta_config
    get_config[:meta]
  end

  # Get action config
  #
  # @return [Hash] returns config for this page
  #
  def get_config
    @get_config ||= GlobalConstant::PageMeta.get(@controller, @action)
  end

end