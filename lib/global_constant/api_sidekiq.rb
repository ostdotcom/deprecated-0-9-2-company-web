# frozen_string_literal: true
module GlobalConstant

  class ApiSidekiq

    class << self

      def namespace
        "ca_api_sidekiq:#{Rails.env}"
      end

      def redis_endpoint
        config['redis_url']
      end

      def admin_user
        config['admin_user']
      end

      def admin_pw
        config['admin_pw']
      end

      private

      def config
        @config || GlobalConstant::Base.api_sidekiq_interface
      end

    end

  end

end
