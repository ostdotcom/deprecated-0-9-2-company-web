module CompanyApi

  module Response

    module Entity

      class OraclePricePoints

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        # @param [CompanyApi::Response::Entity::ClientToken] client_token (mandatory) - client_token entity data
        #
        # @return [CompanyApi::Response::Entity::OraclePricePoints] returns an object of CompanyApi::Response::Entity::OraclePricePoints class
        #
        def initialize(data, client_token)
          @data = data
          @client_token = client_token
        end

        def to_fiat_conversion_rate(curreny_pref)
          conversion_rates[curreny_pref]
        end

        private

        def conversion_rates
          @c_r ||= begin
            if @client_token.is_ost_based_token?
              @data['ost']
            else
              fail 'unsupported'
            end
          end
        end

      end

    end

  end

end
