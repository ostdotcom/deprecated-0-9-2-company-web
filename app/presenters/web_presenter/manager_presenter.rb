module WebPresenter

  class ManagerPresenter < ::WebPresenter::BasePresenter

    # Init
    #
    # @param [Result::Base] data_obj (mandatory) - Page data
    # @param [Hash] params (optional) - Page params
    #
    # @return [Web::Economy::Manager] returns an object of Web::Economy::User class
    #
    def initialize(data_obj, params = {})
      super
    end

    def setup_mfa
      @m_setup_mfa ||= begin
        formatter_obj.present? ? formatter_obj.setup_mfa : nil
      end
    end

  end

end