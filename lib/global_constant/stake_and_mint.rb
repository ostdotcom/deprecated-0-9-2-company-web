# frozen_string_literal: true
module GlobalConstant

  class StakeAndMint

    class << self

      def max_value_of_min_stp_to_mint
        GlobalConstant::StakeAndMint.main_sub_environment? ? 5 : 100
      end

    end

  end

end

