module CompanyApi

  module Response

    module Entity

      class EconomyUser

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::EconomyUser] returns an object of CompanyApi::Response::Entity::EconomyUser class
        #
        def initialize(data)
          @data = data
        end

        def id
          @data['id']
        end

        def name
          @data['name']
        end

        def tokens_airdropped
          @data['tokens_airdropped']
        end

        def tokens_available
          @data['tokens_available']
        end

      end

    end

  end

end
