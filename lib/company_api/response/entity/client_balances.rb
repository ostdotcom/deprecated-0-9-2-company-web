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
          @data['balances']
        end

        def conversion_rates
          @data['conversion_rates']
        end

        def ost_wei_balance
          @o_w_b ||= balances['ost']
        end

        def ost_balance
          @o_b ||= ||= begin
            ost_wei_balance.present? ? convert_from_wei(ost_wei_balance) : nil
          end
        end

        def ost_fiat_balance(currency_pref)
          ost_balance.present? convert_ost_to_fiat(ost_balance, currency_pref) : nil
        end

        def ost_prime_wei_balance
          @o_p_w_b ||= balances['ostPrime']
        end

        def ost_prime_balance
          @o_p_b ||= ||= begin
            ost_prime_wei_balance.present? ? convert_from_wei(ost_prime_wei_balance) : nil
          end
        end

        def ost_prime_fiat_balance(currency_pref)
          ost_prime_balance.present? convert_ost_to_fiat(ost_prime_balance, currency_pref) : nil
        end

        def bt_wei_balance
          @bt_w_b ||= balances['brandedToken']
        end

        def bt_balance
          @bt_b ||= ||= begin
            bt_wei_balance.present? ? convert_from_wei(bt_wei_balance) : nil
          end
        end

        def bt_fiat_balance(currency_pref)
          bt_balance.present? convert_bt_to_fiat(bt_balance, currency_pref) : nil
        end

        private

        def convert_from_wei(value)
          BigDecimal.new(value) / wei_conversion_factor
        end

        def wei_conversion_factor
          BigDecimal.new(10 ** 18)
        end

        def convert_ost_to_fiat(value, currency_symbol)
          value * conversion_rates[currency_symbol]
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
