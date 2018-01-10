# frozen_string_literal: true
module GlobalConstant

  class Base

    class << self

      private

      def env_config
        @env_config ||= fetch_config
      end

      def fetch_config
        @fetch_config ||= begin
          template = ERB.new File.new("#{Rails.root}/config/constants.yml").read
          YAML.load(template.result(binding)).fetch('constants', {}) || {}
        end
      end

    end

  end

end