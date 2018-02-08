module CompanyApi

  module Response

    module Entity

      class ClientOstBalance

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::ClientOstBalance] returns an object of CompanyApi::Response::Entity::ClientOstBalance class
        #
        def initialize(data)
          @data = data
        end

        def ost_balance
          @data['ost_balance'].to_f
        end

      end

    end

  end

end
