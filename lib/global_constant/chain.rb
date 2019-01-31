# frozen_string_literal: true
module GlobalConstant

  class Chain < GlobalConstant::Base

    class << self

      def origin_chain_id
        config['origin_chain_id']
      end

      private

      def config
        GlobalConstant::Base.chain_config
      end

    end

  end

end
