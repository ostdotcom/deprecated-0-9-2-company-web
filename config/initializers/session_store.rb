# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :cookie_store, key: '_ost_kit_session_id', domain: GlobalConstant::CompanyApi.cookie_domain, http_only: true, secure: Rails.env.production?, same_site: :strict