module CompanyApi

  module Response

    module Formatter

      class Token < CompanyApi::Response::Formatter::Base

        # Initialize
        #
        # * Author: Ankit
        # * Date: 03/01/2019
        # * Reviewed By: Kedar
        #
        # @param [Hash] data (mandatory) - company api response data
        #
        # @return [CompanyApi::Response::Formatter::Token] returns an object of CompanyApi::Response::Formatter::Token class
        #
        def initialize(data)
          super
        end

        # Perform
        #
        # * Author: Ankit
        # * Date: 03/01/2019
        # * Reviewed By: Kedar
        #
        def perform
          set_token(@data['token'])
          set_price_points(@data['price_points'])
          set_client_manager(@data['client_manager'])
          set_contract_details(@data['contract_details'])
          set_gas_price(@data['gas_price'])
          set_auxiliary_addresses(@data['auxiliary_addresses'])
          set_origin_addresses(@data['origin_addresses'])
          set_workflow(@data['workflow'])
          set_workflow_current_step(@data['workflow'])
        end

        private

      end

    end

  end

end
