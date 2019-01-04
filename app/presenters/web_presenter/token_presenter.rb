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

    # Client token details in presenter object
    #
    # * Author: Ankit
    # * Date: 03/01/2019
    # * Reviewed By: Kedar
    #
    def client_token
      @t_client_token ||= begin
        formatter_obj.present? ? formatter_obj.client_token : nil
      end
    end

    # Client manager details in presenter object
    #
    # * Author: Santhosh
    # * Date: 03/01/2019
    # * Reviewed By: Kedar
    #
    def client_manager
      @t_client_manager ||= begin
        formatter_obj.present? ? formatter_obj.client_manager : nil
      end
    end

  end

end