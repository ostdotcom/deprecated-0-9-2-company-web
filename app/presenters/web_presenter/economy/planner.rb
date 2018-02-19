module WebPresenter

  module Economy

    class Planner < ::WebPresenter::BasePresenter

      # Init
      #
      # @param [Result::Base] data_obj (mandatory) - Page data
      # @param [Hash] params (optional) - Page params
      #
      # @return [Web::Economy::Planner] returns an object of Web::Economy::Planner class
      #
      def initialize(data_obj, params = {})
        super
      end

      def chain_interaction_params
        @c_ip ||= formatter_obj.chain_interaction_params
      end

      def transaction_types
        @t_ty ||= (formatter_obj.transaction_types || [])
      end

      # after step 3 has been completed, we would not allow this page to open up
      def is_valid_request?
        !client_token.step_three_done?
      end

      def edit_conversion_rate_allowed?
        !client_token.step_three_started?
      end

    end

  end

end