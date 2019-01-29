# frozen_string_literal: true
module GlobalConstant

  class RedirectMap

    class << self

      def get
        {
            token_setup:          "/#{GlobalConstant::Environment.url_prefix}/token/setup",
            token_deploy:         "/#{GlobalConstant::Environment.url_prefix}/token/deploy",
            token_mint:           "/#{GlobalConstant::Environment.url_prefix}/token/mint",
            token_progress:       "/#{GlobalConstant::Environment.url_prefix}/token/mint-progress",
            team:                 "/settings/team",
            setup_mfa:            "/mfa",
            authenticate_mfa:     "/mfa",
            service_unavailable:  "/service_unavailable",
            verify_email:         "/verify-email"
        }
      end

    end

  end

end

