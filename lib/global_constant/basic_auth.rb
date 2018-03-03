# frozen_string_literal: true
module GlobalConstant

  class BasicAuth < GlobalConstant::Base

    class << self

      def username
        config['username']
      end

      def password
        config['password']
      end

      private

      def config
        GlobalConstant::Base.basic_auth_config
      end

    end

  end

end
