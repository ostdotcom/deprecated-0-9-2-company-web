module CompanyApi

  module Response

    module Formatter

      class Client < CompanyApi::Response::Formatter::Base

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - company api response data
        #
        # @return [CompanyApi::Response::Formatter::Client] returns an object of CompanyApi::Response::Formatter::Client class
        #
        def initialize(data)
          super
        end

        # Perform
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        def perform

          set_client_token(@data['client_token'])

        end

      end

    end

  end

end