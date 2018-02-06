module CompanyApi

  module Response

    module Formatter

      class Economy < CompanyApi::Response::Formatter::Base

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - company api response data
        #
        # @return [CompanyApi::Response::Formatter::Economy] returns an object of CompanyApi::Response::Formatter::Economy class
        #
        def initialize(data)
          super
        end

        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        def perform

          set_user(@data['user'])

          set_client_token(@data['client_token'])

          set_client_token_balance(@data['client_token_balance'])

          set_client_ost_balance(@data['client_ost_balance'])

          set_transaction_types(@data['transaction_types']) if @data['transaction_types'].present?

        end

      end

    end

  end

end
