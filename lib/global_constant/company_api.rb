# frozen_string_literal: true
module GlobalConstant

  class CompanyApi < GlobalConstant::Base

    class << self

      def root_url
        config['root_url']
      end

      def basic_auth_user
        config['basic_auth_user']
      end

      def basic_auth_pass
        config['basic_auth_pass']
      end

      def open_timeout
        config['open_timeout']
      end

      def read_timeout
        config['read_timeout']
      end

      def cookie_domain
        config['cookie_domain']
      end

      private

      def config
        GlobalConstant::Base.company_api_config
      end

    end

  end

end
