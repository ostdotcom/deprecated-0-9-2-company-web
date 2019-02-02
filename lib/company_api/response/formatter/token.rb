module CompanyApi

  module Response

    module Formatter

      class Token < CompanyApi::Response::Formatter::Base

        attr_reader :min_eth_in_wei, :min_ost_in_wei, :workflow_payload

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
          set_workflow_current_step(@data['workflow_current_step'])
          set_sign_messages(@data['sign_messages'])
          set_min_eth_in_wei(@data['min_eth_in_wei'])
          set_min_ost_in_wei(@data['min_ost_in_wei'])
          set_workflow_payload(@data['workflow_payload'])
          set_sub_env_payload(@data['sub_env_payloads']) if @data['sub_env_payloads'].present?
        end

        private

        def set_min_eth_in_wei(min_eth_data)
          @min_eth_in_wei = CompanyApi::Response::Entity::MinEthInWei.new(min_eth_data)
        end

        def set_min_ost_in_wei(min_ost_data)
          @min_ost_in_wei = CompanyApi::Response::Entity::MinOstInWei.new(min_ost_data)
        end

        def set_workflow_payload(data)
          @workflow_payload = CompanyApi::Response::Entity::WorkflowPayload.new(data)
        end

      end

    end

  end

end
