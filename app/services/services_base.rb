class ServicesBase

  include Util::ResultHelper

  attr_reader :params

  # Initialize ServiceBase instance
  #
  def initialize(service_params={})
    service_klass = self.class.to_s
    service_params_list = ServicesBase.get_service_params(service_klass)

    # passing only the mandatory and optional params to a service
    permitted_params_list = ((service_params_list[:mandatory] || []) + (service_params_list[:optional] || [])) || []

    permitted_params = {}

    permitted_params_list.each do |pp|
      permitted_params[pp] = service_params[pp]
    end

    @params = HashWithIndifferentAccess.new(permitted_params)
  end

  # Method to get service params from yml file
  #
  def self.get_service_params(service_class)
    # Load mandatory params yml only once
    @mandatory_params ||= YAML.load_file(open(Rails.root.to_s + '/app/services/service_params.yml'))
    @mandatory_params[service_class]
  end

  private

  # Method to validate presence of params
  #
  # @return [Result::Base]
  #
  def validate
    # perform presence related validations here
    # result object is returned
    service_params_list = ServicesBase.get_service_params(self.class.to_s)
    missing_mandatory_params = []

    service_params_list[:mandatory].each do |mandatory_param|
      missing_mandatory_params << mandatory_param if @params[mandatory_param].to_s.blank?
    end if service_params_list[:mandatory].present?

    return error_result('sb_1',
                        'Mandatory params missing.') if missing_mandatory_params.any?

    success_result({})
  end

end