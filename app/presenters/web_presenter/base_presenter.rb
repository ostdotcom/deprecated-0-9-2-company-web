module WebPresenter

  class BasePresenter

    attr_reader :params, :formatter_obj

    # Init
    #
    # @param [Result::Base] data_obj (mandatory) - Page data
    # @param [Hash] params (optional) - Page params
    #
    # Set @formatter_obj - Object of Response::Formatter::Base class
    # Set @params - params
    #
    # @return [Web::BasePresenter] returns an object of Web::Base class
    def initialize(data_obj, params = {})
      @formatter_obj = data_obj.data['formatted_response']
      @params = params
    end

  end

end