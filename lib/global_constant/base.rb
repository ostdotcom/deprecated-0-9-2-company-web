# frozen_string_literal: true
module GlobalConstant

  class Base

    class << self

      def sub_environment
        @sub_environment ||= fetch_config.fetch('sub_env', '')
      end

      def cloudfront_config
        @cloudfront ||= fetch_config.fetch('cloudfront', {}).with_indifferent_access
      end

      def company_api_config
        @company_api_config ||= fetch_config.fetch('company_api', {}).with_indifferent_access
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