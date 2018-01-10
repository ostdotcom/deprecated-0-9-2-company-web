# frozen_string_literal: true
module GlobalConstant

  class PageMeta

    class << self

      def get(controller, action)
        config[controller][action]
      end

      private

      def config
        @config ||= fetch_config
      end

      def fetch_config
        YAML.load_file("#{Rails.root}/config/locales/metadata/en.yml").fetch('en')
      end

    end

  end

end
