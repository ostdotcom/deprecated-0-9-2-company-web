# frozen_string_literal: true
module GlobalConstant

  class Base

    class << self

      def sub_environment
        @sub_environment ||= fetch_config.fetch('sub_env', '')
      end

      def environment_name
        Rails.env
      end

      def main_sub_environment?
        sub_environment == GlobalConstant::Environment.main_sub_env_name
      end

      def sandbox_sub_environment?
        sub_environment == GlobalConstant::Environment.sandbox_sub_env_name
      end

      def root_url
        @root_url ||= fetch_config.fetch('root_url', '')
      end

      def placeholder_image_src
        @placeholder_image_src ||= fetch_config.fetch('placeholder_image_src', '')
      end

      def cloudfront_config
        @cloudfront ||= fetch_config.fetch('cloudfront', {}).with_indifferent_access
      end

      def company_api_config
        @company_api_config ||= fetch_config.fetch('company_api', {}).with_indifferent_access
      end

      # api sidekiq admin interface related configs
      def api_sidekiq_interface
        @api_sidekiq_interface ||= fetch_config.fetch('api_sidekiq_interface', {})
      end

      def basic_auth_config
        @basic_auth_config ||= fetch_config.fetch('basic_auth', {}).with_indifferent_access
      end

      def company_other_product_urls
        @company_other_product_urls ||= fetch_config.fetch('company_other_product_urls', {}).with_indifferent_access
      end

      def chain_config
        @chain_config ||= fetch_config.fetch('chain', {}).with_indifferent_access
      end

      def pepo_campaign
        @stw_campaign_details ||= fetch_config.fetch('pepo_campaign', {}).with_indifferent_access
      end

      def is_public_launch_done?
        true
      end

      def recaptcha
        env_config.fetch('recaptcha', {})
      end

      def env_config
        @env_config ||= fetch_config
      end

      private

      def fetch_config
        @fetch_config ||= begin
          template = ERB.new File.new("#{Rails.root}/config/constants.yml").read
          YAML.load(template.result(binding)).fetch('constants', {}) || {}
        end
      end

    end

  end

end
