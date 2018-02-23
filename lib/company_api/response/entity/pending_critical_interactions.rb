module CompanyApi

  module Response

    module Entity

      class PendingCriticalInteractions

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::PendingCriticalInteractions]
        #
        def initialize(data)
          @data = data
        end

        def for_register_bt_id
          summary_data['propose_bt']
        end

        def for_stake_and_mint_id
          summary_data['stake_bt_started']
        end

        private

        def summary_data
          @data
        end

      end

    end

  end

end
