module CompanyApi

  module Response

    module Entity

      class ClientStats

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::ClientStats] returns an object of CompanyApi::Response::Entity::ClientStats class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def transaction_kind_count
          @data['transaction_kind_count'].to_i
        end

      end

    end

  end

end
