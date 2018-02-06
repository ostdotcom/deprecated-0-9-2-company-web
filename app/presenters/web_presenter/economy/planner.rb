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

      def client_token
        @c_t ||= formatter_obj.client_token
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