module CompanyApi

  module Response

    module Entity

      class TransactionKind

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::TransactionKind] returns an object of CompanyApi::Response::Entity::TransactionKind class
        #
        def initialize(data)
          @data = data
        end

        def id
          @data['id']
        end

        def name
          @data['name']
        end

        def kind
          @data['kind']
        end

        def value_currency_type
          @data['value_currency_type']
        end

        def value_in_usd
          @data['value_in_usd'].to_f
        end

        def value_in_bt
          @data['value_in_bt'].to_f
        end

        def commission_percent
          @data['commission_percent'].to_f
        end

      end

    end

  end

end
