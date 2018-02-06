module CompanyApi

  module Request

    class Base

      include Util::ResultHelper

      require 'net/http'
      require 'cgi'

      # Initialize
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @param [Klass] api_response_formatter_class (mandatory) - Api response formatter_class for api Response
      # @param [Hash] cookies (mandatory) - cookies that need to be sent to API
      # @param [Hash] headers (optional) - headers that need to be sent to API
      #
      # @return [CompanyApi::Request::Base] returns an object of CompanyApi::Request::Base class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        @api_response_formatter_class = api_response_formatter_class
        @cookies = cookies
        @headers = headers

        @company_api_config = GlobalConstant::CompanyApi.config
        @request_class = nil
        @service_base_route = nil
        @api_url = nil
        
      end

      private

      # Get request
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @param [String] api_route (mandatory) - API route
      # @param [Hash] url_params_hash (optional) - API params
      #
      # @return [Result::Base] returns an object of Result::Base class
      #
      def get(api_route, url_params_hash={})
        @request_class = Net::HTTP::Get
        set_api_url(api_route, url_params_hash)
        send
      end

      # POST request
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @param [String] api_route (mandatory) - API route
      # @param [Hash] url_params_hash (optional) - API params
      #
      # @return [Result::Base] returns an object of Result::Base class
      #
      def post(api_route, url_params_hash)
        @request_class = Net::HTTP::Post
        set_api_url(api_route, url_params_hash)
        send
      end

      protected

      # Generate service URL with data
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @return [String] returns API URL Example: "https://companystag:12312121!@stagingost.com/list/get/"
      #
      def set_api_url(api_route, url_params_hash)
        @api_url = base_url + @service_base_route.to_s + api_route + generate_api_parameters(url_params_hash)
      end

      # Base COMPANY API URL
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @return [String] returns BASE API URL Example: "https://stagingost.com/"
      #
      def base_url
        "#{GlobalConstant::CompanyApi.root_url}api/"
      end

      # Generate API parameters
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @return [String] returns API Parameters
      #
      def generate_api_parameters(url_params_hash)
        url_params_hash.present? ? ('?' + url_params_hash.to_query) : ''
      end

      # Get HTTP Request Object
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @param [String] request_uri (mandatory) - API route
      #
      # @return [Net::HTTP::Get or Net::HTTP::POST] return request object with headers and cookies
      #
      def get_request_obj(request_uri)

        req_obj = @request_class.new(request_uri)

        # Forward cookies
        req_obj['Cookie'] = @cookies.map { |k, v| "#{k}=#{CGI.escape v.to_s}" }.join('; ') if @cookies.present?

        # Forward headers
        @headers.each do |h, v|
          req_obj[h] = v
        end if @headers.present?

        # Attach basic auth
        if @company_api_config[:basic_auth_user].present?
          req_obj.basic_auth(@company_api_config[:basic_auth_user], @company_api_config[:basic_auth_pass])
        end

        req_obj

      end

      # make API Request
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @return [Result::Base] returns an object of Result::Base class
      #
      def send
        uri = URI(@api_url)
        http = Net::HTTP.new(uri.host, uri.port)
        if uri.scheme == "https"
          http.use_ssl = true
          http.verify_mode = OpenSSL::SSL::VERIFY_PEER
        end
        http.read_timeout = @company_api_config[:read_timeout]
        http.open_timeout = @company_api_config[:open_timeout]
        req_obj = get_request_obj(uri.request_uri)

        http_response, e = nil, nil
        begin
          http_response = http.request(req_obj)
          parse_api_response(http_response)
        rescue Net::ReadTimeout, Net::OpenTimeout => e
          # Timeouts
          exception_with_internal_code(
              e,
              'company_api_timeout',
              'company api timeout',
              GlobalConstant::ErrorCode.internal_server_error,
              debug_data
          )
        rescue Exception => e
          # Exceptions
          binding.pry
          exception_with_internal_code(e, 'company_api_exception', 'company api exception', GlobalConstant::ErrorCode.internal_server_error, debug_data)
        end

      end

      # Parse API response
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @return [Result::Base] returns an object of Result::Base class
      #
      def parse_api_response(http_response)
        
        response_data = Oj.load(http_response.body, mode: :strict) rescue {} #, {symbol_keys: true}

        case http_response.class.name
          when 'Net::HTTPOK'
            if response_data['success']
              # Success
              formatted_data = format_success_response_data(response_data['data'])
              success_with_data(formatted_data)
            else
              # API Error
              Rails.logger.info("=*=COMPANY-API-ERROR=*= #{response_data.inspect}")
              error_with_internal_code('company_api_error', 'company api error', GlobalConstant::ErrorCode.internal_server_error, {}, {}, response_data['err']['display_text'])
            end
          when 'Net::HTTPUnauthorized', 'Net::HTTPPreconditionFailed'
            # Login required
            Rails.logger.info("=*=COMPANY-API-ERROR=*= Net::HTTPUnauthorized")
            error_with_internal_code('company_api_login_required', 'company api login required', GlobalConstant::ErrorCode.unauthorized_access, {}, {}, 'HTTPUnauthorized')
          when 'Net::HTTPNotFound'
            # Page not found - 404
            Rails.logger.info("=*=COMPANY-API-ERROR=*= '404 Not Found'")
            error_with_internal_code('company_api_not_found', 'company api not found', GlobalConstant::ErrorCode.not_found, {}, {}, '404 Not Found')
          else
            # HTTP error status code (500, 504...)
            exception_with_internal_code(
                Exception.new("COMPANY API STATUS CODE #{http_response.code.to_i}"),
                'company_api_exception',
                'company api exception',
                http_response.code,
                debug_data
            )
        end
        
      end

      # Debug data for exception emails
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @return [Hash] returns an hash of critical information for debugging
      #
      def debug_data
        {
            cookie: @cookies,
            headers: @headers,
            api_url: @api_url
        }
      end

      # Format success response data
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By:
      #
      # @param [Hash] data (mandatory) - API success response data
      #
      # @return [Hash <objects>] returns an hash of entity objects
      #
      def format_success_response_data(data)
        if data.present? && @api_response_formatter_class.present?
          format_obj = @api_response_formatter_class.new(data)
          format_obj.perform
          {'formatted_response' => format_obj}
        else
          data
        end
      end

    end

  end

end