module WebPresenter

  class TokenPresenter < ::WebPresenter::BasePresenter

    # Init
    #
    # @param [Result::Base] data_obj (mandatory) - Page data
    # @param [Hash] params (optional) - Page params
    #
    # @return [Web::Economy::Token] returns an object of Web::Economy::Token class
    #
    def initialize(data_obj, params = {})
      super
    end

    # Client manager details in presenter object
    #
    # * Author: Santhosh
    # * Date: 03/01/2019
    # * Reviewed By: Kedar
    #
    def client_manager
      @t_client_manager ||= begin
        formatter_obj.present? ? formatter_obj.client_manager : nil
      end
    end

    # contract details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def contract_details
      @t_contract_details ||= begin
        formatter_obj.present? ? formatter_obj.contract_details : nil
      end
    end

    # gas_price details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def gas_price
      @t_gas_price ||= begin
        formatter_obj.present? ? formatter_obj.gas_price : nil
      end
    end

    # auxiliary_addresses details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def auxiliary_addresses
      @t_auxiliary_addresses ||= begin
        formatter_obj.present? ? formatter_obj.auxiliary_addresses : nil
      end
    end

    # origin_addresses details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def origin_addresses
      @t_origin_addresses ||= begin
        formatter_obj.present? ? formatter_obj.origin_addresses : nil
      end
    end

    # origin_addresses details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def workflow
      @t_workflow ||= begin
        formatter_obj.present? ? formatter_obj.workflow : nil
      end
    end

    # origin_addresses details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def workflow_payload
      @t_workflow_p ||= begin
        formatter_obj.present? ? formatter_obj.workflow_payload : nil
      end
    end

    # origin_addresses details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def workflow_current_step
      @t_workflow_csp ||= begin
        formatter_obj.present? ? formatter_obj.workflow_current_step : nil
      end
    end

    # minimum ost in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def min_ost_in_wei
      @t_min_ost ||= begin
        formatter_obj.present? ? formatter_obj.min_ost_in_wei : nil
      end
    end

    # minimum eth in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def min_eth_in_wei
      @t_min_eth ||= begin
        formatter_obj.present? ? formatter_obj.min_eth_in_wei : nil
      end
    end


  end

end