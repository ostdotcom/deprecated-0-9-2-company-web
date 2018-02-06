module CompanyApi

  module Response

    module Entity

      class TokenSupplyDetails

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::TokenSupplyDetails] returns an object of CompanyApi::Response::Entity::TokenSupplyDetails class
        #
        def initialize(data)
          @data = data
        end

        def tokens_minted
          @data['tokens_minted'].to_f
        end

        def tokens_distributed
          @data['tokens_distributed'].to_f
        end

      end

    end

  end

end
