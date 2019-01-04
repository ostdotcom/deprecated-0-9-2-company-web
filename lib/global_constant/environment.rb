module GlobalConstant

  class Environment

    class << self

      def main_sub_env_name
        'main'
      end

      def sandbox_sub_env_name
        'sandbox'
      end

      def main_sub_env_url_prefix
        'mainnet'
      end

      def sandbox_sub_url_prefix
        'testnet'
      end

      def url_prefix
        if GlobalConstant::Base.main_sub_environment?
          main_sub_env_url_prefix
        else
          sandbox_sub_url_prefix
        end
      end

    end

  end

end