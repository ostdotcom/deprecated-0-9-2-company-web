module CompanyApi

  module Response

    module Formatter

      class Economy < CompanyApi::Response::Formatter::Base

        attr_reader :client_stats, :api_console_data, :client_bt_addresses

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Hash] data (mandatory) - company api response data
        #
        # @return [CompanyApi::Response::Formatter::Economy] returns an object of CompanyApi::Response::Formatter::Economy class
        #
        def initialize(data)
          super
        end

        # Perform
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        def perform

          set_user(@data['user'])

          set_client_token(@data['client_token'])

          set_oracle_price_points(@data['oracle_price_points'])

          set_pending_critical_interactions(@data['pending_critical_interactions']) if @data['pending_critical_interactions'].present?

          set_client_token_planner(@data['client_token_planner']) if @data['client_token_planner'].present?

          set_chain_interaction_params(@data['chain_interaction_params']) if @data['chain_interaction_params'].present?

          set_client_balances(@data['client_balances']) if @data['client_balances'].present?

          set_token_supply_details(@data['token_supply_details']) if @data['token_supply_details'].present?

          set_client_stats(@data['client_stats']) if @data['client_stats'].present?

          set_api_console_data(@data['api_console_data']) if @data['api_console_data'].present?

          set_client_bt_addresses_data(@data['client_bt_addresses']) if @data['client_bt_addresses'].present?

        end

        private

        # Set client stats details
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] client_stats_data (mandatory) - client stats hash
        #
        # Sets @client_stats
        #
        def set_client_stats(client_stats_data)
          @client_stats = CompanyApi::Response::Entity::ClientStats.new(client_stats_data)
        end

        # Set API Console details
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] api_console_data (mandatory) - API Console hash
        #
        # Sets @api_console_data
        #
        def set_api_console_data(api_console_data)
          @api_console_data = CompanyApi::Response::Entity::ApiConsoleData.new(api_console_data)
        end

        # Set Client BT Addresss Data
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] client_bt_addresses_data (mandatory) - client_bt_addresses_data hash
        #
        # Sets @client_bt_addresses
        #
        def set_client_bt_addresses_data(client_bt_addresses_data)
          @client_bt_addresses = CompanyApi::Response::Entity::ClientBrandedTokenAddresses.new(client_bt_addresses_data)
        end

      end

    end

  end

end
