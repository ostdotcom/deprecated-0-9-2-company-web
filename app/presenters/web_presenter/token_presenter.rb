module WebPresenter

  class TokenPresenter < ::WebPresenter::BasePresenter

    # Init
    #
    # @param [Result::Base] data_obj (mandatory) - Page data
    # @param [Hash] params (optional) - Page params
    #
    # @return [Web::Economy::Token] returns an object of Web::Economy::Token class
    #
    def initialize(data_obj, params = {})
      super
    end

    def client_token
      @t_client_token ||= begin
        formatter_obj.present? ? formatter_obj.client_token : nil
      end
    end

  end

end