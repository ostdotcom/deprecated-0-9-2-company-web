module CompanyApi

  module Response

    module Formatter

      class Base

        attr_reader :manager, :client, :client_token, :oracle_price_points, :chain_interaction_params,
                    :client_token_planner, :client_balances, :token_supply_details, :pending_critical_interactions,
                    :client_manager, :contract_details, :gas_price, :auxiliary_addresses, :origin_addresses,
                    :workflow, :workflow_current_step, :sign_messages, :sub_env_payloads

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
        def set_token(client_token_data)
          @client_token = CompanyApi::Response::Entity::Token.new(client_token_data)
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
        def set_sign_messages(sign_messages_data)
          @sign_messages = CompanyApi::Response::Entity::SignMessages.new(sign_messages_data)
        end

        # Set orace_price_points_data
        #
        # * Author: Ankit
        # * Date: 03/01/2019
        # * Reviewed By:
        #
        # @param [Hash] price_points_data (mandatory) - price oracle data hash
        #
        # Sets @oracle_price_points
        #
        def set_price_points(price_points_data)
          @oracle_price_points = CompanyApi::Response::Entity::PricePoints.new(price_points_data, @client_token)
        end

        # Set client manager data
        #
        # * Author: Santhosh
        # * Date: 03/01/2019
        # * Reviewed By: Kedar
        #
        # @param [Hash] client_manager_data (mandatory) - client manager data hash
        #
        # Sets @client_manager
        def set_client_manager(client_manager_data)
          @client_manager = CompanyApi::Response::Entity::Manager.new(client_manager_data)
        end

        # Set contract details data
        #
        # * Author: Alpesh
        # * Date: 18/01/2019
        # * Reviewed By:
        #
        # @param [Hash] contract_details_data (mandatory) - contract_details data hash
        #
        # Sets @client_manager
        def set_contract_details(contract_details_data)
          @contract_details = CompanyApi::Response::Entity::ContractDetails.new(contract_details_data)
        end

        # Set gas price data
        #
        # * Author: Alpesh
        # * Date: 18/01/2019
        # * Reviewed By:
        #
        # @param [Hash] gas_price_data (mandatory) - gas_price data hash
        #
        # Sets @client_manager
        def set_gas_price(gas_price_data)
          @gas_price = CompanyApi::Response::Entity::GasPrice.new(gas_price_data)
        end

        # Set auxiliary_addresses data
        #
        # * Author: Alpesh
        # * Date: 18/01/2019
        # * Reviewed By:
        #
        # @param [Hash] auxiliary_addresses_data (mandatory) - auxiliary_addresses data hash
        #
        # Sets @auxiliary_addresses
        def set_auxiliary_addresses(auxiliary_addresses_data)
          @auxiliary_addresses = CompanyApi::Response::Entity::AuxiliaryAddresses.new(auxiliary_addresses_data)
        end

        # Set origin_addresses data
        #
        # * Author: Alpesh
        # * Date: 18/01/2019
        # * Reviewed By:
        #
        # @param [Hash] origin_addresses_data (mandatory) - origin_addresses data hash
        #
        # Sets @origin_addresses
        def set_origin_addresses(origin_addresses_data)
          @origin_addresses = CompanyApi::Response::Entity::OriginAddresses.new(origin_addresses_data)
        end

        # Set workflow data
        #
        # * Author: Alpesh
        # * Date: 18/01/2019
        # * Reviewed By:
        #
        # @param [Hash] workflow_data (mandatory) - workflow data hash
        #
        # Sets @workflow
        #
        def set_workflow(workflow_data)
          @workflow = CompanyApi::Response::Entity::Workflow.new(workflow_data)
        end

        # Set workflow_current_step data
        #
        # * Author: Alpesh
        # * Date: 18/01/2019
        # * Reviewed By:
        #
        # @param [Hash] workflow_step_data (mandatory) - workflow_current_step data hash
        #
        # Sets @origin_addresses
        def set_workflow_current_step(workflow_step_data)
          @workflow_current_step = CompanyApi::Response::Entity::WorkflowCurrentStep.new(workflow_step_data)
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

        def set_sub_env_payload(data)
          @sub_env_payloads = CompanyApi::Response::Entity::SubEnvPayloads.new(data)
        end

      end

    end

  end

end
