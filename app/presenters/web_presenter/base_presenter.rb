module WebPresenter

  class BasePresenter

    attr_reader :params, :formatter_obj

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
      @params = params
    end

    def user
      @c_usr ||= begin
        formatter_obj.present? ? formatter_obj.user : nil
      end
    end

    def client_token
      @c_t ||= begin
        formatter_obj.present? ? formatter_obj.client_token : nil
      end
    end

    def client_token_balance
      @c_tb ||= begin
        formatter_obj.present? ? formatter_obj.client_token_balance : nil
      end
    end

    def client_ost_balance
      @c_ob ||= begin
        formatter_obj.present? ? formatter_obj.client_ost_balance : nil
      end
    end

    def ost_fiat_converter
      @o_fc ||= begin
        formatter_obj.present? ? formatter_obj.ost_fiat_converter : nil
      end
    end

    def is_client_logged_in?
      client_token.present?
    end

    def client_token_symbol
      @c_t_sym ||= begin
        client_token.present? ? client_token.symbol : nil
      end
    end

    def client_fiat_curreny_pref
      'usd'
    end

    def client_token_to_ost_conversion_rate
      @c_t_t_o_c_r ||= client_token.conversion_rate.to_f
    end

    def client_token_to_fiat_conversion_rate
      @c_t_t_f_c_r ||= (client_token_to_ost_conversion_rate * ost_fiat_converter.conversion_rate(client_fiat_curreny_pref))
    end

    def token_to_fiat_value(bt_value)
      ost_fiat_converter.ost_to_fiat(bt_value * client_token_to_ost_conversion_rate, client_fiat_curreny_pref)
    end

    def currency_to_string(curreny)
      curreny.to_s #TODO: Figure out a logic to handle this
    end

  end

end