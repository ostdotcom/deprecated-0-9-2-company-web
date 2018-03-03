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

        def conversion_factors
          @c_r ||= @data.present? ? @data['oracle_price_points'] : {}
        end

        def ost_based_conversion_factors
          @os_b_c_r ||= begin
            return {} if conversion_factors.blank?
            conversion_factors['OST'].each do |currency_symbol, conversion_factor|
              conversion_factors['OST'][currency_symbol] = BigDecimal.new(conversion_factor)
            end
            conversion_factors['OST']
          end
        end

        def ost_balance
          @o_b ||= begin
            balances['OST'].present? ? BigDecimal.new(balances['OST']) : nil
          end
        end

        def ost_balance_s
          @o_b_s ||= begin
            ost_balance.present? ? format_balance_to_s(ost_balance) : nil
          end
        end

        def ost_fiat_balance(currency_pref)
          ost_balance.present? ? convert_ost_to_fiat(ost_balance, currency_pref) : nil
        end

        def ost_fiat_balance_s(currency_pref)
          ost_balance.present? ? format_fiat_balance_to_s(convert_ost_to_fiat(ost_balance, currency_pref)) : nil
        end

        def eth_balance
          @e_b ||= begin
            balances['eth'].present? ? BigDecimal.new(balances['eth']) : nil
          end
        end

        def eth_balance_s
          @e_b_s ||= begin
            eth_balance.present? ? format_balance_to_s(eth_balance) : nil
          end
        end

        def eth_fiat_balance(currency_pref)
          eth_balance.present? ? convert_ost_to_fiat(eth_balance, currency_pref) : nil
        end

        def eth_fiat_balance_s(currency_pref)
          eth_balance.present? ? format_fiat_balance_to_s(convert_ost_to_fiat(eth_balance, currency_pref)) : nil
        end

        def ost_prime_balance
          @o_p_b ||= begin
            balances['ostPrime'].present? ? BigDecimal.new(balances['ostPrime']) : nil
          end
        end

        def ost_prime_balance_s
          @o_p_s ||= begin
            ost_prime_balance.present? ? format_balance_to_s(ost_prime_balance) : nil
          end
        end

        def ost_prime_fiat_balance(currency_pref)
          ost_prime_balance.present? ? convert_ost_to_fiat(ost_prime_balance, currency_pref) : nil
        end

        def ost_prime_fiat_balance_s(currency_pref)
          ost_prime_balance.present? ? format_fiat_balance_to_s(convert_ost_to_fiat(ost_prime_balance, currency_pref)) : nil
        end

        def bt_balance
          @bt_b ||= begin
            balances[@client_token.symbol].present? ? BigDecimal.new(balances[@client_token.symbol]) : nil
          end
        end

        def bt_balance_s
          @bt_b_s ||= begin
            bt_balance.present? ? format_balance_to_s(bt_balance) : nil
          end
        end

        def bt_fiat_balance(currency_pref)
          bt_balance.present? ? convert_bt_to_fiat(bt_balance, currency_pref) : nil
        end

        def bt_fiat_balance_s(currency_pref)
          bt_balance.present? ? format_fiat_balance_to_s(convert_bt_to_fiat(bt_balance, currency_pref)) : nil
        end

        def format_fiat_balance_to_s(balance)
          balance.round(2)
        end

        def format_balance_to_s(balance)
          balance.round(5)
        end

        def convert_bt_to_fiat(bt_value, currency_symbol)
          if @client_token.is_ost_based_token?
            ost_value = convert_bt_to_ost(bt_value)
            convert_ost_to_fiat(ost_value, currency_symbol)
          else
            fail 'unsupported BT'
          end
        end

        def ost_to_fiat_conversion_factor(currency_symbol)
          ost_based_conversion_factors[currency_symbol]
        end

        def is_eligible_for_ost_grant?
          ost_balance.blank? || ost_balance < 1000
        end

        def is_eligible_for_eth_grant?
          eth_balance.blank? || eth_balance < 0.05
        end

        private

        def convert_ost_to_fiat(value, currency_symbol)
          value * ost_based_conversion_factors[currency_symbol]
        end

        def convert_bt_to_ost(value)
          value / @client_token.conversion_factor
        end

      end

    end

  end

end
