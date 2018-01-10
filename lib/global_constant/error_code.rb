# frozen_string_literal: true
module GlobalConstant

  class ErrorCode

    class << self

      def ok
        200
      end

      def permanent_redirect
        301
      end

      def temporary_redirect
        302
      end

      def unauthorized_access
        401
      end

      def not_found
        404
      end

      def internal_server_error
        500
      end

    end

  end

end
