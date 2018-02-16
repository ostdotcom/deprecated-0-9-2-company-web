# frozen_string_literal: true
module GlobalConstant

  class Cloudfront < GlobalConstant::Base

    class << self

      def root_url
        config['root_url']
      end

      private

      def config
        GlobalConstant::Base.cloudfront_config
      end

    end

  end

end
