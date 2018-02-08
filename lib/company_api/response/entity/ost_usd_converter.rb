module CompanyApi

  module Response

    module Entity

      class OstUsdConverter

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Float] conversion_factor (mandatory)
        #
        # @return [CompanyApi::Response::Entity::OstUsdConverter] returns an object of CompanyApi::Response::Entity::OstUsdConverter class
        #
        def initialize(conversion_factor)
          @conversion_factor = Float(conversion_factor)
        end

        def ost_to_usd(ost_value)
          Float(ost_value) * @conversion_factor
        end

        def usd_to_ost(usd_value)
          Float(usd_value) / @conversion_factor
        end

      end

    end

  end

end
