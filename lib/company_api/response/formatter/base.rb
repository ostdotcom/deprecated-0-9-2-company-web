module CompanyApi

  module Response

    module Formatter

      class Base

        attr_reader :user, :client_token, :client_balances, :next_page_payload

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
        # * Reviewed By: Sunil
        #
        # @param [Hash] client_token_data (mandatory) - client token hash
        #
        # Sets @client_token
        #
        def set_client_token(client_token_data)
          @client_token = CompanyApi::Response::Entity::ClientToken.new(client_token_data)
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

        # Set next page payload
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Hash] payload_data (mandatory) - payload hash
        #
        # Sets @client_token_balance
        #
        def set_next_page_payload(payload_data)
          @next_page_payload = CompanyApi::Response::Entity::PaginationPayload.new(payload_data)
        end

      end

    end

  end

end
