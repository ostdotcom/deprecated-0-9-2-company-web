module CompanyApi

  module Request

    class Manager < CompanyApi::Request::Base

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
      # @return [CompanyApi::Request::Manager] returns an object of CompanyApi::Request::Client class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super(api_response_formatter_class, cookies, false, headers)
        @service_base_route = 'manager/'

      end

      # Get details to load data on signup page
      #
      # * Author: Puneet
      # * Date: 08/12/2018
      # * Reviewed By:
      #
      # @param [Hash] params
      #
      def get_sign_up_page_details(params)
        get('sign-up', params)
      end

      # Get details to load QR code for setting up MFA
      #
      # * Author: Puneet
      # * Date: 08/12/2018
      # * Reviewed By:
      #
      # @param [Hash] params
      #
      def get_setup_mfa_details(params)
        get('mfa', params)
      end

      # Get details to load QR code for setting up MFA
      #
      # * Author: Puneet
      # * Date: 08/12/2018
      # * Reviewed By:
      #
      # @param [Hash] params
      #
      def get_manager_details(params)
        get('', params)
      end

      # Get details to load QR code for setting up MFA
      #
      # * Author: Puneet
      # * Date: 08/12/2018
      # * Reviewed By:
      #
      # @param [Hash] params
      #
      def get_team_details(params)
        get('team', params)
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
        get('verify-email', params)
      end

      # Fire Logout request to API
      #
      # * Author: Puneet
      # * Date: 14/02/2018
      # * Reviewed By:
      #
      # @param [Hash] params - contains authenticity_token (authenticity_token)
      #
      def logout(params)
        get('logout', params)
      end

    end

  end

end
