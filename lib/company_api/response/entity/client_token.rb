module CompanyApi

  module Response

    module Entity

      class ClientToken

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::ClientToken] returns an object of CompanyApi::Response::Entity::ClientToken class
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

        def symbol
          @data['symbol']
        end

        def symbol_url
          @data['symbol_url']
        end

        def setup_steps
          @data['setup_steps']
        end

        def conversion_rate
          @data['conversion_rate']
        end

        def airdrop_bt_per_user
          @data['airdrop_bt_per_user']
        end

        def initial_number_of_users
          @data['initial_number_of_users']
        end

        def step_one_done?
          if @s_o_d.nil?
            setup_steps.include?('set_conversion_rate')
          end
          @s_o_d
        end

        def step_two_done?
          if @s_two_d.nil?
            setup_steps.include?('configure_transactions')
          end
          @s_two_d
        end

        def step_three_started?
          if @s_th_s.nil?
            setup_steps.include?('propose_initiated')
          end
          @s_th_s
        end

        def step_three_done?
          if @s_th_d.nil?
            setup_steps.include?('registered_on_vc')
          end
          @s_th_d
        end

      end

    end

  end

end
