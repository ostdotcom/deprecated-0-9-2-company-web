module CompanyApi

  module Response

    module Formatter

      class Base

        attr_reader :user, :client_token, :transaction_types, :client_ost_balance, :client_token_balance

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
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
        # * Reviewed By:
        #
        # @param [Hash] user_data (mandatory) - user data hash
        #
        # Sets @user
        #
        def set_user(user_data)
          @user = CompanyApi::Response::Entity::User.new(user_data)
        end

        # Set client token
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] client_token_data (mandatory) - client token hash
        #
        # Sets @client_token
        #
        def set_client_token(client_token_data)
          @client_token = CompanyApi::Response::Entity::ClientToken.new(client_token_data)
        end

        # Set client token
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] client_token_data (mandatory) - client token hash
        #
        # Sets @client_ost_balance
        #
        def set_client_ost_balance(client_ost_balance)
          @client_ost_balance = CompanyApi::Response::Entity::ClientOstBalance.new(client_ost_balance)
        end

        # Set client token
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] client_token_data (mandatory) - client token hash
        #
        # Sets @client_token_balance
        #
        def set_client_token_balance(client_token_balance)
          @client_token_balance = CompanyApi::Response::Entity::ClientTokenBalance.new(client_token_balance)
        end

        # Set transaction types
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] transaction_types_data (mandatory) - transaction types hash
        #
        # Sets @transaction_types
        #
        def set_transaction_types(transaction_types_data)
          @transaction_types = transaction_types_data.inject({}) do |formatted_data, transaction_type_data|
            formatted_data[transaction_type_data['id'].to_i] = CompanyApi::Response::Entity::TransactionKind.new(transaction_type_data)
          end
        end

      end

    end

  end

end
