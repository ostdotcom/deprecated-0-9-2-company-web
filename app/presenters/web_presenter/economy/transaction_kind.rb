module WebPresenter

  module Economy

    class TransactionKind < ::WebPresenter::BasePresenter

      # Init
      #
      # @param [Result::Base] data_obj (mandatory) - Page data
      # @param [Hash] params (optional) - Page params
      #
      # @return [Web::Economy::TransactionKind] returns an object of Web::Economy::TransactionKind class
      #
      def initialize(data_obj, params = {})
        super
      end

      def transaction_types
        @t_types ||= (formatter_obj.transaction_types || [])
      end

    end

  end

end