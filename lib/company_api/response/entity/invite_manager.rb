module CompanyApi

  module Response

    module Entity

      class InviteManager

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::InviteManager] returns an object of CompanyApi::Response::Entity::InviteManager class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def email
          @data['email']
        end

      end

    end

  end

end
