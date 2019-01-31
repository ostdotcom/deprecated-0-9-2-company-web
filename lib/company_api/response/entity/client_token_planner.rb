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

        def data
          @data
        end

        def client_id
          @data['client_id']
        end

        def airdrop_bt_per_user
          BigDecimal.new(@data['initial_airdrop'])
        end

        def initial_number_of_users
          @data['initial_no_of_users'].to_i
        end

        def token_worth_in_usd
          BigDecimal.new(@data['token_worth_in_usd'])
        end

        def default_initial_users
          config['default_initial_users'].to_i
        end

        def buffer_mint_factor_over_airdrop
          config['buffer_mint_factor_over_airdrop'].to_i
        end

        def max_allowed_token_worth_in_usd
          config['max_allowed_token_worth_in_usd'].to_i
        end

        private

        def config
          @data['config']
        end

      end

    end

  end

end
