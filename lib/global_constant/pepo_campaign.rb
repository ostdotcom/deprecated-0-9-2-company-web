# frozen_string_literal: true
module GlobalConstant

  class PepoCampaign

    class << self

      def encrypted_client_id
        config['encrypted_client_id']
      end

      def encrypted_list_id
        config['encrypted_list_id']
      end

      def subscribe_url
        @subscribe_url ||= "https://pepocampaigns.com/subscribe-jsonp/?ct=#{encrypted_client_id}&ld=#{encrypted_list_id}"
      end

      private

      def config
        @config ||= GlobalConstant::Base.pepo_campaign
      end

    end

  end

end
