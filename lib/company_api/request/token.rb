module CompanyApi

  module Request

    class Token < CompanyApi::Request::Base

      # Initialize
      #
      # * Author: Ankit
      # * Date: 03/01/2019
      # * Reviewed By: Kedar
      #
      # @param [Klass] api_response_formatter_class (mandatory) - Api response formatter_class for api Response
      # @param [Hash] cookies (mandatory) - cookies that need to be sent to API
      # @param [Hash] headers (optional) - headers that need to be sent to API
      #
      # @return [CompanyApi::Request::Manager] returns an object of CompanyApi::Request::Token class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super(api_response_formatter_class, cookies, true, headers)
        @service_base_route = 'token/'

      end

      def fetch_token_details
        get('')
      end

      def token_deploy
        get('deploy', {})
      end

      def mint
        get('mint', {})
      end

      def mint_progress
        get('mint-progress', {})
      end

      private

    end

  end

end
