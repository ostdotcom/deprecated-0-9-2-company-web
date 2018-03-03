module CompanyApi

  module Response

    module Entity

      class ApiConsoleData

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::ApiConsoleData] returns an object of CompanyApi::Response::Entity::ApiConsoleData class
        #
        def initialize(data)
          @data = data
        end

        def for_execute_transaction
          transaction_data['execute']
        end

        def for_create_user
          user_data['create']
        end

        def for_create_transaction_kind
          transaction_kind_data['create']
        end

        private

        def transaction_data
          @t_d ||= (@data['transaction'] || {})
        end

        def user_data
          @u_d ||= (@data['user'] || {})
        end

        def transaction_kind_data
          @t_k_d ||= (@data['transaction_kind'] || {})
        end

      end

    end

  end

end
