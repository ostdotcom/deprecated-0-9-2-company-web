module CompanyApi

  module Response

    module Entity

      class Client

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::Client] returns an object of CompanyApi::Response::Entity::Client class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def id
          @data['id']
        end

      end

    end

  end

end
