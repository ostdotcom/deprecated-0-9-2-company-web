module CompanyApi

  module Request

    class Client < CompanyApi::Request::Base

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
      # @return [CompanyApi::Request::Client] returns an object of CompanyApi::Request::Client class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super
        @service_base_route = 'client/'

      end

      # Fetch Details of steps performed for setting up economy
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By: Sunil
      #
      def fetch_verify_cookie_details
        get('verify-cookie')
      end

      # Verify Email
      #
      # * Author: Puneet
      # * Date: 14/02/2018
      # * Reviewed By:
      #
      # @param [Hash] params - contains token (r_t)
      #
      def verify_email(params)
        post('verify-email', params)
      end

      # Fire Logout request to API
      #
      # * Author: Puneet
      # * Date: 14/02/2018
      # * Reviewed By:
      #
      def logout
        post('logout', {})
      end

    end

  end

end
