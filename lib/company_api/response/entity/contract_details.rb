module CompanyApi

  module Response

    module Entity

      class ContractDetails

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::Manager] returns an object of CompanyApi::Response::Entity::User class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def simple_token
          @stc ||= @data["simple_token"]
        end

        def branded_token
          @stc ||= @data["branded_token"]
        end

        def simple_token_address
          simple_token["address"]
        end

        def branded_token_address
          branded_token["address"]
        end

        def simple_token_abi
          simple_token["abi"]
        end

        def simple_token_gas
          simple_token["gas"]
        end

      end

    end

  end

end
