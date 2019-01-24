module CompanyApi

  module Response

    module Entity

      class ChainInteractionParams

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::ChainInteractionParams] returns an object of CompanyApi::Response::Entity::ChainInteractionParams class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def utility_chain_id
          @data['utility_chain_id']
        end

        def utility_chain_geth_rpc_provider
          @data['utility_chain_geth_rpc_provider']
        end

        def value_chain_id
          @data['value_chain_id']
        end

        def value_chain_geth_rpc_provider
          @data['value_chain_geth_rpc_provider']
        end

        def simple_token_contract_addr
          @data['simple_token_contract_addr']
        end

        def staker_addr
          @data['staker_addr']
        end

        def value_chain_gas_price
          @data['value_chain_gas_price']
        end

      end

    end

  end

end
