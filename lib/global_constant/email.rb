# frozen_string_literal: true
module GlobalConstant

  class Email

    class << self

      def default_from
        Rails.env.production? ? 'notifier@ost.com' : 'staging.notifier@ost.com'
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
