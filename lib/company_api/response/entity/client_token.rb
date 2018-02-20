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
        # @param [Integer] pending_critical_interaction_id (mandatory) - pending transaction id
        #
        # @return [CompanyApi::Response::Entity::ClientToken] returns an object of CompanyApi::Response::Entity::ClientToken class
        #
        def initialize(data, pending_critical_interaction_id)
          @data = data
          @pending_critical_interaction_id = pending_critical_interaction_id
        end

        def id
          @data['id']
        end

        def client_id
          @data['client_id']
        end

        def name
          @data['name']
        end

        def symbol
          @data['symbol']
        end

        def symbol_icon
          @data['symbol_icon']
        end

        def setup_steps
          @data['setup_steps']
        end

        def conversion_rate
          @data['conversion_rate'].to_f
        end

        def is_ost_based_token?
          true
        end

        def step_one_done?
          if @s_o_d.nil?
            @s_o_d = setup_steps.include?('set_conversion_rate')
          end
          @s_o_d
        end

        def step_two_done?
          if @s_two_d.nil?
            @s_two_d = setup_steps.include?('configure_transactions')
          end
          @s_two_d
        end

        def step_three_started?
          if @s_th_s.nil?
            @s_th_s = setup_steps.include?('propose_initiated')
          end
          @s_th_s
        end

        def step_three_done?
          if @s_th_d.nil?
            @s_th_d = setup_steps.include?('registered_on_vc')
          end
          @s_th_d
        end

        def pending_critical_interaction_id
          @pending_critical_interaction_id
        end

      end

    end

  end

end
