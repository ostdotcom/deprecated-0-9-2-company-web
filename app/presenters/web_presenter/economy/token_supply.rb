module WebPresenter

  module Economy

    class TokenSupply < ::WebPresenter::BasePresenter

      # Init
      #
      # @param [Result::Base] data_obj (mandatory) - Page data
      # @param [Hash] params (optional) - Page params
      #
      # @return [WebPresenter::Economy::TokenSupply] returns an object of WebPresenter::Economy::TokenSupply class
      #
      def initialize(data_obj, params = {})
        super
      end

      def token_supply_details
        @t_sly_dtls ||= formatter_obj.token_supply_details
      end

    end

  end

end