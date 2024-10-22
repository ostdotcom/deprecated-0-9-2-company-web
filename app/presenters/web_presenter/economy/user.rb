module WebPresenter

  module Economy

    class User < ::WebPresenter::BasePresenter

      # Init
      #
      # @param [Result::Base] data_obj (mandatory) - Page data
      # @param [Hash] params (optional) - Page params
      #
      # @return [WebPresenter::Economy::User] returns an object of WebPresenter::Economy::User class
      #
      def initialize(data_obj, params = {})
        super
      end

      def api_console_data
        @a_cd ||= (formatter_obj.api_console_data || {})
      end

    end

  end

end