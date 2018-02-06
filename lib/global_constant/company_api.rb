# frozen_string_literal: true
module GlobalConstant

  class CompanyApi < GlobalConstant::Base

    class << self

      def root_url
        config['root_url']
      end

      def config
        env_config['company_api'].with_indifferent_access
      end

    end

  end

end
