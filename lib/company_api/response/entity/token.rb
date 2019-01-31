module CompanyApi

  module Response

    module Entity

      class Token

        # Initialize
        #
        # * Author: Ankit
        # * Date: 03/01/2019
        # * Reviewed By: Kedar
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::Token] returns an object of CompanyApi::Response::Entity::Token class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def name
          @data['name']
        end

        def symbol
          @data['symbol']
        end

        def conversion_factor
          @data['conversion_factor']
        end

        def is_ost_based_token?
          true
        end

        def status
          @data['status']
        end

      end

    end

  end

end
