module CompanyApi

  module Request

    class Economy < CompanyApi::Request::Base

      # Initialize
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By: Sunil
      #
      # @param [Klass] api_response_formatter_class (mandatory) - Api response formatter_class for api Response
      # @param [Hash] cookies (mandatory) - cookies that need to be sent to API
      # @param [Hash] headers (optional) - headers that need to be sent to API
      #
      # @return [CompanyApi::Request::Economy] returns an object of CompanyApi::Request::Economy class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super
        @service_base_route = 'economy/'

      end

      # Fetch Details for step one
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      def fetch_planner_step_one_details
        get('token/get-step-one-details')
      end

      # Fetch Details for step two
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      def fetch_planner_step_two_details
        get('token/get-step-two-details')
      end

      # Fetch Details for step three
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      def fetch_planner_step_three_details
        get('token/get-step-three-details')
      end

      # Fetch Details for step three
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      def fetch_dashboard_details
        get('token/get-dashboard-details')
      end

      # Fetch token supply details
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By: Sunil
      #
      def fetch_supply_details
        get('token/get-supply-details')
      end

      # Fetch Details of users
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By: Sunil
      #
      def fetch_user_details
        get('users/list')
      end

      # Fetch transaction kinds
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By: Sunil
      #
      def fetch_transaction_kinds_details
        get('transaction/kind/list')
      end

      # Fetch simulator details
      #
      # * Author: Puneet
      # * Date: 03/03/2018
      # * Reviewed By:
      #
      def fetch_simulator_details
        get('transaction/fetch-simulator-details')
      end

      # Fetch developer API Console Details
      #
      # * Author: Puneet
      # * Date: 03/03/2018
      # * Reviewed By:
      #
      def fetch_developer_api_console_details
        get('developer-api-console')
      end

      private

    end

  end

end
