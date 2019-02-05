# frozen_string_literal: true
module GlobalConstant

  class RoutesMap

    class << self

      def getRoutes
        {
          token_setup:          "/#{GlobalConstant::Environment.url_prefix}/token/setup",
          mainnet_token_setup:  "/#{GlobalConstant::Environment.main_sub_env_url_prefix}/token/setup",
          sandbox_token_setup:  "/#{GlobalConstant::Environment.sandbox_sub_url_prefix}/token/setup",
          token_deploy:         "/#{GlobalConstant::Environment.url_prefix}/token/deploy",
          token_mint:           "/#{GlobalConstant::Environment.url_prefix}/token/mint",
          token_progress:       "/#{GlobalConstant::Environment.url_prefix}/token/mint-progress",
          developer:            "/#{GlobalConstant::Environment.url_prefix}/developer",
          team:                 "/settings/team",
          setup_mfa:            "/mfa",
          authenticate_mfa:     "/mfa",
          service_unavailable:  "/service_unavailable",
          verify_email:         "/verify-email"
        }
      end

      def getApis
        {
            api_token:            "/#{GlobalConstant::Environment.url_prefix}/api/token",
            api_addresses:        "/#{GlobalConstant::Environment.url_prefix}/api/token/addresses",
            api_deploy:           "/#{GlobalConstant::Environment.url_prefix}/api/token/deploy",
            api_workflow:         "/#{GlobalConstant::Environment.url_prefix}/api/workflow",
            api_mint:             "/#{GlobalConstant::Environment.url_prefix}/api/token/mint",
            api_grant:            "/#{GlobalConstant::Environment.url_prefix}/api/token/mint/grant",
            api_gateway_composer: "/#{GlobalConstant::Environment.url_prefix}/api/contracts/gateway-composer",
            api_reset_deployment: "/#{GlobalConstant::Environment.url_prefix}/api/token/reset-deployment",
            api_request_whitelist:"/#{GlobalConstant::Environment.main_sub_env_url_prefix}/api/token/request-whitelist",
            get_api_keys:         "/#{GlobalConstant::Environment.url_prefix}/api/developer/api-keys",
            delete_api_key:       "/#{GlobalConstant::Environment.url_prefix}/api/developer/api-keys/delete",
            api_list_admins:      "/api/manager/list-admins",
            delete_admin_endpoint:"/api/manager/super_admin/delete-admin",
            update_role_endpoint: "/api/manager/super_admin/update-super-admin-role",
            reset_mfa_endpoint:   "/api/manager/super_admin/reset-mfa",
            resend_admin_invite:  "/api/manager/super_admin/resend-admin-invite",
            api_invite_admin:     "/api/manager/super_admin/invite-admin",
            api_sign_up:          "/api/manager/sign-up",
            api_mfa:              "/api/manager/mfa",
            api_get_ost:          "/api/client/get-ost",
            api_send_reset_password_link:"/api/manager/send-reset-password-link",
            api_login:            "/api/manager/login",
            api_reset_password:   "/api/manager/reset-password",
            api_send_verify_email_link:"/api/manager/send-verify-email-link",
        }
      end

    end

  end

end

