module CompanyApi

  module Request

    class Economy < CompanyApi::Request::Base

      # Initialize
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @param [Klass] api_response_formatter_class (mandatory) - Api response formatter_class for api Response
      # @param [Hash] cookies (mandatory) - cookies that need to be sent to API
      # @param [Hash] headers (optional) - headers that need to be sent to API
      #
      # @return [CompanyApi::Request::EconomyPlanner] returns an object of CompanyApi::Request::EconomyPlanner class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super
        @service_base_route = 'economy/token/'

      end

      # Fetch Details of steps performed for setting up economy
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      def fetch_planner_details
        get('get-setup-details')
      end

      private

    end

  end

end
