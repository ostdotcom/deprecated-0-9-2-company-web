module CompanyApi

  module Response

    module Formatter

      class Base

        attr_reader :manager, :client, :client_token, :oracle_price_points, :chain_interaction_params,
                    :client_token_planner, :client_balances, :token_supply_details, :pending_critical_interactions

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Hash] data (mandatory) - company api response data
        #
        # @return [CompanyApi::Response::Formatter::Base] returns an object of CompanyApi::Response::Formatter::Base class
        #
        def initialize(data)
          @data = data
        end

        private

        # Set user
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Hash] manager_data (mandatory) - user data hash
        #
        # Sets @manager
        #
        def set_manager(manager_data)
          @manager = CompanyApi::Response::Entity::Manager.new(manager_data)
        end

        # Set client
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Hash] client_data (mandatory) - client token hash
        #
        # Sets @client_token
        #
        def set_client(client_data)
          @client = CompanyApi::Response::Entity::Client.new(client_data)
        end

        # Set client token
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Hash] client_token_data (mandatory) - client token hash
        #
        # Sets @client_token
        #
        def set_client_token(client_token_data)
          @client_token = CompanyApi::Response::Entity::ClientToken.new(client_token_data)
        end

        # Set client token planner
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Hash] client_token_planner_data (mandatory) - client token hash
        #
        # Sets @client_token_planner
        #
        def set_client_token_planner(client_token_planner_data)
          @client_token_planner = CompanyApi::Response::Entity::ClientTokenPlanner.new(client_token_planner_data)
        end

        # Set chain_interaction_params
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] chain_interaction_params (mandatory) -
        #
        # Sets @chain_interaction_params
        #
        def set_chain_interaction_params(chain_interaction_params_data)
          @chain_interaction_params = CompanyApi::Response::Entity::ChainInteractionParams.new(chain_interaction_params_data)
        end

        # Set client balances
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Hash] client_token_data (mandatory) - client token hash
        #
        # Sets @client_token
        #
        def set_client_balances(client_balances_data)
          @client_balances = CompanyApi::Response::Entity::ClientBalances.new(client_balances_data, @client_token)
        end

        # Set token supply details
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Hash] token_supply_details_data (mandatory) - token supply details hash
        #
        # Sets @client_token_balance
        #
        def set_token_supply_details(token_supply_details_data)
          @token_supply_details = CompanyApi::Response::Entity::TokenSupplyDetails.new(token_supply_details_data)
        end

        # Set orace_price_points_data
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] orace_price_points_data (mandatory) - price oracle data hash
        #
        # Sets @oracle_price_points
        #
        def set_oracle_price_points(orace_price_points_data)
          @oracle_price_points = CompanyApi::Response::Entity::OraclePricePoints.new(orace_price_points_data, @client_token)
        end

        # Set Pending Critical Interactions Data
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] pending_critical_interactions_data (mandatory)
        #
        # Sets @pending_critical_interactions
        #
        def set_pending_critical_interactions(pending_critical_interactions_data)
          @pending_critical_interactions = CompanyApi::Response::Entity::PendingCriticalInteractions.new(pending_critical_interactions_data)
        end

      end

    end

  end

end
