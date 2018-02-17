module CompanyApi

  module Response

    module Entity

      class ClientTokenPlanner

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::ClientTokenPlanner] returns an object of CompanyApi::Response::Entity::ClientTokenPlanner class
        #
        def initialize(data)
          @data = data
        end

        def client_id
          @data['client_id']
        end

        def airdrop_bt_per_user
          @data['initial_airdrop']
        end

        def initial_number_of_users
          @data['initial_no_of_users']
        end

        def token_worth_in_usd
          @data['token_worth_in_usd'].to_f
        end

      end

    end

  end

end
