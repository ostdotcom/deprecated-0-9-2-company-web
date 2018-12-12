module WebPresenter

  class BasePresenter

    attr_reader :params, :raw_data, :formatter_obj

    # Init
    #
    # @param [Result::Base] data_obj (mandatory) - Page data
    # @param [Hash] params (optional) - Page params
    #
    # Set @formatter_obj - Object of Response::Formatter::Base class
    # Set @params - params
    #
    # @return [Web::BasePresenter] returns an object of Web::Base class
    def initialize(data_obj, params = {})
      @formatter_obj = data_obj.data['formatted_response']
      @raw_data = data_obj.data['raw_data']
      @params = params
    end

    def manager
      @c_manager ||= begin
        formatter_obj.present? ? formatter_obj.manager : nil
      end
    end

    def client
      @client ||= begin
        formatter_obj.present? ? formatter_obj.client : nil
      end
    end

    def client_token
      @c_t ||= begin
        formatter_obj.present? ? formatter_obj.client_token : nil
      end
    end

    def oracle_price_points
      @o_p_p ||= begin
        formatter_obj.present? ? formatter_obj.oracle_price_points : nil
      end
    end

    def chain_interaction_params
      @c_ip ||= formatter_obj.chain_interaction_params
    end

    def is_eligible_for_ost_grant?
      return GlobalConstant::Base.main_sub_environment? ? false : client_balances.is_eligible_for_ost_grant?
    end

    def is_eligible_for_eth_grant?
      return GlobalConstant::Base.main_sub_environment? ? false : client_balances.is_eligible_for_eth_grant?
    end

    def client_token_planner
      @c_t_p ||= begin
        formatter_obj.present? ? formatter_obj.client_token_planner : nil
      end
    end

    def pending_critical_interactions
      @p_c_i ||= begin
        formatter_obj.present? ? formatter_obj.pending_critical_interactions : nil
      end
    end

    def client_balances
      @c_balances ||= begin
        formatter_obj.present? ? formatter_obj.client_balances : nil
      end
    end

    def token_supply_details
      @t_sly_dtls ||= formatter_obj.present? ? formatter_obj.token_supply_details : nil
    end

    def is_client_logged_in?
      client_token.present?
    end

    def client_token_symbol
      @c_t_sym ||= begin
        client_token.present? ? client_token.symbol : nil
      end
    end

    def client_fiat_curreny_symbol
      'USD'
    end

    def client_fiat_curreny_display_text
      'USD'
    end

    def client_fiat_curreny_pref_symbol
      '$'
    end

    def currency_to_string(curreny)
      curreny.to_s #TODO: Figure out a logic to handle this
    end

    def is_planner_route?
      ['planner' , 'planner_step_two' , 'planner_step_three'].include?(action)
    end

    def action
      @params[:action]
    end

    def can_show_email_verify_notification?
      false
    end

    def can_show_low_balance_notification?
      true
    end

  end

end