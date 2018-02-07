module CompanyApi

  module Response

    module Entity

      class ClientTokenBalance

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::ClientTokenBalance] returns an object of CompanyApi::Response::Entity::ClientTokenBalance class
        #
        def initialize(data)
          @data = data
        end

        def token_balance
          @data['token_balance'].to_f
        end

        def token_balance_in_ost
          token_balance * token_to_ost_conversion_rate
        end

        def token_to_ost_conversion_rate
          @data['token_to_ost_conversion_rate'].to_f
        end

      end

    end

  end

end
