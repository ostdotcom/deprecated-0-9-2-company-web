module CompanyApi

  module Response

    module Entity

      class PaginationPayload

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::PaginationPayload] returns an object of CompanyApi::Response::Entity::PaginationPayload class
        #
        def initialize(data)
          @data = data
        end

        def payload
          @data
        end

      end

    end

  end

end
