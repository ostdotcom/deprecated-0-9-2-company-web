# frozen_string_literal: true
module GlobalConstant

  class Email

    class << self

      def default_from
        Rails.env.production? ? 'notifier@simpletoken.com' : 'notifier@stagingsimpletoken.com'
      end

      def default_to
        ['bala@pepo.com', 'sunil@pepo.com', 'kedar@pepo.com', 'abhay@pepo.com','aman@pepo.com', 'alpesh@pepo.com', 'akshay@pepo.com', 'thahir@pepo.com']
      end

      def subject_prefix
        "CW #{Rails.env} : "
      end

    end

  end

end
