module CompanyApi

  module Response

    module Entity

      class SetupMfa

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::SetupMfa] returns an object of CompanyApi::Response::Entity::SetupMfa class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def qr_code_url
          @data['qr_code_url']
        end

      end

    end

  end

end
