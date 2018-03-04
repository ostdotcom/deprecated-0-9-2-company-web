module WebPresenter

  module Economy

    class TransactionKind < ::WebPresenter::BasePresenter

      # Init
      #
      # @param [Result::Base] data_obj (mandatory) - Page data
      # @param [Hash] params (optional) - Page params
      #
      # @return [WebPresenter::Economy::TransactionKind] returns an object of WebPresenter::Economy::TransactionKind class
      #
      def initialize(data_obj, params = {})
        super
      end

      def api_console_data
        @a_cd ||= (formatter_obj.api_console_data || {})
      end

      def client_stats
        @c_sts ||= (formatter_obj.client_stats || {})
      end

    end

  end

end