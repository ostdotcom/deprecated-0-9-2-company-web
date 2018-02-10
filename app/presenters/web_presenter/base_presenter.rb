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

    def client_balances
      @c_balances ||= begin
        formatter_obj.present? ? formatter_obj.client_balances : nil
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

    def client_fiat_curreny_pref_symbol
      '$'
    end

    def currency_to_string(curreny)
      curreny.to_s #TODO: Figure out a logic to handle this
    end

    def action
      @params[:action]
    end

  end

end