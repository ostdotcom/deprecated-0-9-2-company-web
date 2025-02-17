# frozen_string_literal: true
module GlobalConstant

  class Email

    class << self

      def default_from
        if Rails.env.production?
          if GlobalConstant::Base.sub_environment == 'main'
            'notifier@ost.com'
          else
            'sandbox.notifier@ost.com'
          end
        else
          'staging.notifier@ost.com'
        end
      end

      def default_to
        ['backend@ost.com']
      end

      def subject_prefix
        "[OST-Kit-Web-#{Rails.env}-#{GlobalConstant::Base.sub_environment}] :: "
      end

    end

  end

end

