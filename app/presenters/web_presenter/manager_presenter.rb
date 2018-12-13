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

    def inviter_manager
      @m_inviter_manager ||= begin
        formatter_obj.present? ? formatter_obj.inviter_manager : nil
      end
    end

    def invitee_manager
      @m_invitee_manager ||= begin
        formatter_obj.present? ? formatter_obj.invitee_manager : nil
      end
    end

  end

end