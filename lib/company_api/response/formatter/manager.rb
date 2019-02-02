module CompanyApi

  module Response

    module Formatter

      class Manager < CompanyApi::Response::Formatter::Base

        attr_reader :managers, :setup_mfa, :inviter_manager, :invitee_manager

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By: Sunil
        #
        # @param [Hash] data (mandatory) - company api response data
        #
        # @return [CompanyApi::Response::Formatter::Manager] returns an object of CompanyApi::Response::Formatter::Client class
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

          set_managers(@data['managers']) if @data['managers'].present?

          set_manager(@data['manager']) if @data['manager'].present?

          set_inviter_manager(@data['inviter_manager']) if @data['inviter_manager'].present?

          set_invitee_manager(@data['invitee_manager']) if @data['invitee_manager'].present?

          set_client(@data['client']) if @data['client'].present?

          set_client_manager(@data['client_manager']) if @data['client_manager'].present?

          set_setup_mfa(@data['setup_mfa']) if @data['setup_mfa'].present?

          set_token(@data['token']) if @data['token'].present?

          set_sub_env_payload(@data['sub_env_payloads']) if @data['sub_env_payloads'].present?
        end

        private

        # Set managers
        #
        # * Author: Puneet
        # * Date: 12/12/2018
        # * Reviewed By:
        #
        # @param [Hash] managers_data (mandatory) - user data hash
        #
        # Sets @managers
        #
        def set_managers(managers_data)
          @managers = {}
          managers_data.each do |manager_id, manager_data|
            @managers[manager_id] = CompanyApi::Response::Entity::Manager.new(manager_data)
          end
        end

        # Set setup mfa
        #
        # * Author: Puneet
        # * Date: 12/12/2018
        # * Reviewed By:
        #
        # @param [Hash] managers_data (mandatory) - user data hash
        #
        # Sets @managers
        #
        def set_setup_mfa(data)
          @setup_mfa = CompanyApi::Response::Entity::SetupMfa.new(data)
        end

        # Set setup mfa
        #
        # * Author: Puneet
        # * Date: 12/12/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory)
        #
        # Sets @inviter_manager
        #
        def set_inviter_manager(data)
          @inviter_manager = CompanyApi::Response::Entity::InviteManager.new(data)
        end

        # Set setup mfa
        #
        # * Author: Puneet
        # * Date: 12/12/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory)
        #
        # Sets @invitee_manager
        #
        def set_invitee_manager(data)
          @invitee_manager = CompanyApi::Response::Entity::InviteManager.new(data)
        end

      end

    end

  end

end