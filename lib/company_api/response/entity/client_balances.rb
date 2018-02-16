module CompanyApi

  module Response

    module Entity

      class ClientBalances

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        # @param [CompanyApi::Response::Entity::ClientToken] client_token (mandatory) - client_token entity data
        #
        # @return [CompanyApi::Response::Entity::ClientBalances] returns an object of CompanyApi::Response::Entity::ClientBalances class
        #
        def initialize(data, client_token)
          @data = data
          @client_token = client_token
        end

        def balances
          @data.present? ? @data['balances'] : {}
        end

        def conversion_rates
          @c_r ||= @data.present? ? @data['orace_price_points'] : {}
        end

        def ost_based_conversion_rates
          @os_b_c_r ||= conversion_rates.present? ? conversion_rates['ost'] : {}
        end

        def ost_balance
          @o_b ||= begin
            balances['ost']
          end
        end

        def ost_fiat_balance(currency_pref)
          ost_balance.present? ? convert_ost_to_fiat(ost_balance, currency_pref) : nil
        end

        def ost_prime_balance
          @o_p_b ||= begin
            balances['ostPrime']
          end
        end

        def ost_prime_fiat_balance(currency_pref)
          ost_prime_balance.present? ? convert_ost_to_fiat(ost_prime_balance, currency_pref) : nil
        end

        def bt_balance
          @bt_b ||= begin
            balances[@client_token.symbol]
          end
        end

        def bt_fiat_balance(currency_pref)
          bt_balance.present? ? convert_bt_to_fiat(bt_balance, currency_pref) : nil
        end

        def ost_to_fiat_conversion_factor(currency_symbol)
          ost_based_conversion_rates[currency_symbol]
        end

        private

        def convert_ost_to_fiat(value, currency_symbol)
          value * ost_based_conversion_rates[currency_symbol]
        end

        def convert_bt_to_fiat(bt_value, currency_symbol)
          if @client_token.is_ost_based_token?
            ost_value = convert_bt_to_ost(bt_value)
            convert_ost_to_fiat(ost_value, currency_symbol)
          else
            fail 'unsupported BT'
          end
        end

        def convert_bt_to_ost(value)
          value * @client_token.conversion_rate
        end

      end

    end

  end

end
