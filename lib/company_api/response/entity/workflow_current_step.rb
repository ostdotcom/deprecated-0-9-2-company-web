module CompanyApi

  module Response

    module Entity

      class WorkflowCurrentStep

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

        def display_text
          @data["display_text"]
        end

        def percent_completion
          @data["percent_completion"]
        end

        def status
          @data["status"]
        end

        def name
          @data["name"]
        end

      end

    end

  end

end
