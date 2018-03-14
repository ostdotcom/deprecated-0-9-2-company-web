# frozen_string_literal: true
module GlobalConstant

  class Cloudfront < GlobalConstant::Base

    class << self

      def domain
        config['domain']
      end

      private

      def config
        GlobalConstant::Base.cloudfront_config
      end

    end

  end

end
