module CompanyApi

  module Response

    module Entity

      class User

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::User] returns an object of CompanyApi::Response::Entity::User class
        #
        def initialize(data)
          @data = data
        end

        def id
          @data['id']
        end

        def email
          @data['email']
        end

        def status
          @data['status']
        end

        def properties
          @data['properties']
        end

        def is_verified?
          properties.include?('user_verified')
        end

      end

    end

  end

end
