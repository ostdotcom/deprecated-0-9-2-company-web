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

    end

  end

end
