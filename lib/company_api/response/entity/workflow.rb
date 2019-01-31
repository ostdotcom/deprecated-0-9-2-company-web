module CompanyApi

  module Response

    module Entity

      class Workflow

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

        def is_present?
          id.present?
        end

        def id
          @data["id"]
        end

        def kind
          @data["kind"]
        end

      end

    end

  end

end
