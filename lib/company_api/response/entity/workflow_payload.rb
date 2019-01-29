module CompanyApi

  module Response

    module Entity

      class WorkflowPayload

        # Initialize
        #
        # * Author: Ankit
        # * Date: 30/01/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::WorkflowPayload]
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def fe_ost_to_stake
          data["fe_ost_to_stake"]
        end

        def fe_bt_to_mint
          data["fe_bt_to_mint"]
        end

      end

    end

  end

end
