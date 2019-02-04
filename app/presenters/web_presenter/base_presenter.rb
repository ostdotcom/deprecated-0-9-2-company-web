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

    def client_manager
      @client ||= begin
        formatter_obj.present? ? formatter_obj.client_manager : nil
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

    def sign_messages
      @t_s_sn_msg ||= formatter_obj.present? ? formatter_obj.sign_messages : nil
    end

    def is_super_admin?
      @i_s_adm  ||= begin
        if formatter_obj.present? && formatter_obj.client_manager.present?
          formatter_obj.client_manager.privileges.include?(GlobalConstant::ClientManager.is_super_admin_privilege)
        end
      end
    end

    def client_token_name
      @c_t_nam ||= begin
        client_token.present? ? client_token.name : nil
      end
    end

    def client_token_symbol
      @c_t_sym ||= begin
        client_token.present? ? client_token.symbol : nil
      end
    end

    def client_token_conversion_factor
      @c_t_cfac ||= begin
        client_token.present? ? client_token.conversion_factor : nil
      end
    end

    def client_token_status
      @c_t_sts ||= begin
        client_token.present? ? client_token.status : nil
      end
    end

    def is_client_token_deployed?
      client_token_status == GlobalConstant::ClientToken.deployment_completed
    end

    def is_client_token_deploying?
      client_token_status == GlobalConstant::ClientToken.deployment_started
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

    def can_show_email_verify_notification?
      false
    end

    def can_show_low_balance_notification?
      true
    end

    ##### Left side panel routes

    def action
      @params[:action]
    end

    def controller
      @params[:controller]
    end

    def is_token_setup_route?
      ['token_setup' , 'token_deploy'].include?(action) && ['web/economy'].include?(controller)
    end

    def is_token_mint_route?
      ['token_mint' , 'token_mint_progress'].include?(action) && ['web/economy'].include?(controller)
    end

    def is_developer_route?
      ['developer'].include?(action) && ['web/developer'].include?(controller)
    end

    def is_settings_route?
      ['web/user_setting'].include?(controller)
    end

    def is_team_route?
      ['team'].include?(action) && is_settings_route?
    end

    def sub_env_payloads
      @s_env_pl ||= begin
        formatter_obj.present? ? formatter_obj.sub_env_payloads : nil
      end
    end

  end

end