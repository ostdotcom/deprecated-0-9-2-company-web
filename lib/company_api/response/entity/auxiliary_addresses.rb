module CompanyApi

  module Response

    module Entity

      class AuxiliaryAddresses

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

        def whitelisted
          @data["whitelisted"]
        end

        def owner
          @data["owner"]
        end

        def admin
          @data["admin"]
        end

        def workers
          @data["workers"]
        end

      end

    end

  end

end
