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

        def data
          @data
        end

        def tokens_minted
          @t_m ||= begin
            @data['tokens_minted'].present? ? BigDecimal.new(@data['tokens_minted']) : @data['tokens_minted']
          end
        end

        def tokens_distributed
          @t_d ||= begin
            @data['tokens_distributed'].present? ? BigDecimal.new(@data['tokens_distributed']) : @data['tokens_distributed']
          end
        end

      end

    end

  end

end
