module WebPresenter

  module Economy

    class Simulator < ::WebPresenter::BasePresenter

      # Init
      #
      # @param [Result::Base] data_obj (mandatory) - Page data
      # @param [Hash] params (optional) - Page params
      #
      # @return [WebPresenter::Economy::Simulator] returns an object of WebPresenter::Economy::Simulator class
      #
      def initialize(data_obj, params = {})
        super
      end

      def api_console_data
        @a_cd ||= (formatter_obj.api_console_data || {})
      end

      def ost_view_tx_detail_url_prefix
        "#{GlobalConstant::CompanyOtherProductUrls::view_root_url}chain-id/#{chain_interaction_params.utility_chain_id}/transaction/"
      end

    end

  end

end