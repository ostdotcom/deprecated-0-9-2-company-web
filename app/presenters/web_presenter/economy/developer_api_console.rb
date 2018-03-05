module WebPresenter

  module Economy

    class DeveloperApiConsole < ::WebPresenter::BasePresenter

      # Init
      #
      # @param [Result::Base] data_obj (mandatory) - Page data
      # @param [Hash] params (optional) - Page params
      #
      # @return [WebPresenter::Economy::DeveloperApiConsole] returns an object of WebPresenter::Economy::DeveloperApiConsole class
      #
      def initialize(data_obj, params = {})
        super
      end

      def client_bt_addresses
        @c_bt_addrs ||= (formatter_obj.client_bt_addresses || nil)
      end

    end

  end

end