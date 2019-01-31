module CompanyApi

  module Response

    module Entity

      class ClientBrandedTokenAddresses

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::ClientBrandedTokenAddresses] returns an object of CompanyApi::Response::Entity::ClientBrandedTokenAddresses class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def erc20_contract_address
          @data['erc20_contract_address']
        end

        def airdrop_contract_address
          @data['airdrop_contract_address']
        end

        def reserve_address
          @data['reserve_address']
        end

        def airdrop_holder_address
          @data['airdrop_holder_address']
        end

        def reserve_uuid
          @data['reserve_uuid']
        end

      end

    end

  end

end
