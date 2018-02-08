module CompanyApi

  module Response

    module Entity

      class OstFiatConverter

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Float] conversion_factor (mandatory)
        #
        # @return [CompanyApi::Response::Entity::OstFiatConverter] returns an object of CompanyApi::Response::Entity::OstUsdConverter class
        #
        def initialize(conversion_factors)
          @conversion_factors = conversion_factors.inject({}) do |buffer, (fiat_currency_sym, conversion_factor)|
            buffer.merge!(fiat_currency_sym => Float(conversion_factor))
          end
        end

        # convert from OST to Fiat
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Float] ost_value (mandatory)
        # @param [String] currency_symbol (mandatory) : 'usd'
        #
        # @return [Float]
        #
        def ost_to_fiat(ost_value, currency_symbol)
          Float(ost_value) * @conversion_factors[currency_symbol]
        end

        # convert to OST from Fiat
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Float] ost_value (mandatory)
        # @param [String] currency_symbol (mandatory) : 'usd'
        #
        # @return [Float]
        #
        def fiat_to_ost(fiat_value)
          Float(fiat_value) / @conversion_factors[currency_symbol]
        end

        # converion rate
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [String] currency_symbol (mandatory) : 'usd'
        #
        # @return [Float]
        #
        def conversion_rate(currency_symbol)
          @conversion_factors[currency_symbol]
        end

      end

    end

  end

end
