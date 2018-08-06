# frozen_string_literal: true
module GlobalConstant

  class ChainInteractionConstants < GlobalConstant::Base

    class << self

      def value_main_net_id
        config['value_main_net_id']
      end

      def value_ropsten_net_id
        config['value_ropsten_net_id']
      end

      private

      def config
        GlobalConstant::Base.chain_interaction_constants
      end

    end

  end

end
