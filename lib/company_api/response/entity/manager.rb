module CompanyApi

  module Response

    module Entity

      class Manager

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::Manager] returns an object of CompanyApi::Response::Entity::User class
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

        def email
          @data['email']
        end

        def status
          @data['status']
        end

        def properties
          @data['properties']
        end

        def privileges
          @data['privileges']
        end

        def is_verified?
          properties.include?('has_verified_email')
        end

        def has_setup_mfa?
          properties.include?('has_setup_mfa')
        end

      end

    end

  end

end
