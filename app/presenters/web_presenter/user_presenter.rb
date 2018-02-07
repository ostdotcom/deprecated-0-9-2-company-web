module WebPresenter

  class UserPresenter < ::WebPresenter::BasePresenter

    # Init
    #
    # @param [Result::Base] data_obj (mandatory) - Page data
    # @param [Hash] params (optional) - Page params
    #
    # @return [Web::Economy::User] returns an object of Web::Economy::User class
    #
    def initialize(data_obj, params = {})
      super
    end

    def client_token
      @c_t ||= formatter_obj.client_token
    end

  end

end