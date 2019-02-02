module CompanyApi

  module Response

    module Entity

      class SubEnvPayloads

        # Initialize
        #
        # * Author: Ankit
        # * Date: 30/01/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::SubEnvPayloads]
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def mainnet_data
          data["mainnet"]
        end

        def testnet_data
          data["testnet"]
        end

        def is_mainnet_whitelisted?
          !(data["mainnet"]["whitelisted"].to_i).zero? #to convert the given value to boolean

        end

        def is_mainnet_whitelisting_requested?
          !(data["mainnet"]["whitelisting_requested"].to_i).zero?
        end

      end

    end

  end

end
