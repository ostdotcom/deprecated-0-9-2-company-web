module WebPresenter

  module Economy

    class User < ::WebPresenter::BasePresenter

      # Init
      #
      # @param [Result::Base] data_obj (mandatory) - Page data
      # @param [Hash] params (optional) - Page params
      #
      # @return [Web::Economy::User] returns an object of Web::Economy::User class
      #
      def initialize(data_obj, params = {})
        super
      end

      def economy_users
        @e_usrs ||= (formatter_obj.economy_users || [])
      end

      def next_page_payload
        @n_pld ||= (formatter_obj.next_page_payload || {})
      end

    end

  end

end