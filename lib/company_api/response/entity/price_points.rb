module CompanyApi

  module Response

    module Entity

      class PricePoints

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        # @param [CompanyApi::Response::Entity::Token] token (mandatory) - token entity data
        #
        # @return [CompanyApi::Response::Entity::PricePoints] returns an object of CompanyApi::Response::Entity::OraclePricePoints class
        #
        def initialize(data, token)
          @data = data
          @client_token = token
        end

        def data
          @data
        end

        def to_fiat_conversion_factor(curreny_pref)
          conversion_factors[curreny_pref]
        end

        private

        def conversion_factors
          @c_r ||= begin
            if @client_token.is_ost_based_token?
              @data['OST'].each do |currency_symbol, conversion_factor|
                @data['OST'][currency_symbol] = BigDecimal.new(conversion_factor)
              end
              @data['OST']
            else
              fail 'unsupported'
            end
          end
        end

      end

    end

  end

end
