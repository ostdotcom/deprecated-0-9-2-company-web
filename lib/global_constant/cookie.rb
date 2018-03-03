# frozen_string_literal: true
module GlobalConstant

  class Cookie

    class << self

      def user_cookie_name
        'ost_kit_ca'
      end

      # Not a actual cookie. but key is used internally to manage cookies instructed by company API
      def new_api_cookie_key
        'ost_kit_new_api_cookies'
      end

    end

  end

end
