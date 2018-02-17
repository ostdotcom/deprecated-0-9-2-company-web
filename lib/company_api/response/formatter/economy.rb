module CompanyApi

  module Response

    module Formatter

      class Economy < CompanyApi::Response::Formatter::Base

        attr_reader :transaction_types, :economy_users, :token_supply_details

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

          set_client_token_planner(@data['client_token_planner']) if @data['client_token_planner'].present?

          set_client_balances(@data['client_balances']) if @data['client_balances'].present?

          set_transaction_types(@data['transaction_types']) if @data['transaction_types'].present?

          set_economy_users(@data['economy_users']) if @data['economy_users'].present?

          set_token_supply_details(@data['token_supply_details']) if @data['token_supply_details'].present?

          set_next_page_payload(@data['next_page_payload']) if @data['next_page_payload'].present?

        end

        private

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

        # Set transaction types
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Array] transaction_types_data (mandatory) - transaction types hash
        #
        # Sets @transaction_types
        #
        def set_transaction_types(transaction_types_data)
          @transaction_types = transaction_types_data.inject({}) do |formatted_data, transaction_type_data|
            formatted_data[transaction_type_data['id'].to_i] = CompanyApi::Response::Entity::TransactionKind.new(transaction_type_data)
            formatted_data
          end
        end

        # Set economy users
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Array] economy_users_data (mandatory) - economy users hash
        #
        # Sets @economy_users
        #
        def set_economy_users(economy_users_data)
          @economy_users = economy_users_data.inject({}) do |formatted_data, economy_user_data|
            formatted_data[economy_user_data['id'].to_i] = CompanyApi::Response::Entity::EconomyUser.new(economy_user_data)
            formatted_data
          end
        end

      end

    end

  end

end
