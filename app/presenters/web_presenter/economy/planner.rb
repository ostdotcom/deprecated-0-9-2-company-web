module WebPresenter

  module Economy

    class Planner < ::WebPresenter::BasePresenter

      # Init
      #
      # @param [Result::Base] data_obj (mandatory) - Page data
      # @param [Hash] params (optional) - Page params
      #
      # @return [WebPresenter::Economy::Planner] returns an object of WebPresenter::Economy::Planner class
      #
      def initialize(data_obj, params = {})
        super
      end

      def client_stats
        @c_sts ||= (formatter_obj.client_stats || {})
      end

      def api_console_data
        @a_cd ||= (formatter_obj.api_console_data || {})
      end

      # after step 3 has been completed, we would not allow this page to open up
      def is_valid_request?
        !client_token.step_three_done?
      end

    end

  end

end