module Result

  class Base

    attr_accessor :error,
                  :error_display_text,
                  :error_display_heading,
                  :error_data,
                  :data,
                  :exception,
                  :http_code

    # Initialize
    #
    # @param [Hash] params (optional) is a Hash
    #
    def initialize(params = {})
      set_error(params)
      set_http_code(params[:http_code])
      @data = params[:data] || {}
    end

    # Set Http Code
    #
    # @param [Integer] h_c is an Integer http_code
    #
    def set_http_code(h_c)
      @http_code = h_c || GlobalConstant::ErrorCode.ok
    end

    # Set Error
    #
    # @param [Hash] params is a Hash
    #
    def set_error(params)
      @error = params[:error] if params.key?(:error)
      @error_display_text = params[:error_display_text] if params.key?(:error_display_text)
      @error_data = params[:error_data] if params.key?(:error_data)
      @error_display_heading = params[:error_display_heading] if params.key?(:error_display_heading)
    end

    # Set Exception
    #
    # @param [Exception] e is an Exception
    #
    def set_exception(e)
      @exception = e
    end

    # is valid?
    #
    # @return [Boolean] returns True / False
    #
    def valid?
      !invalid?
    end

    # is invalid?
    #
    # @return [Boolean] returns True / False
    #
    def invalid?
      errors_present?
    end

    # Define error / failed methods
    #
    [:error?, :errors?, :failed?].each do |name|
      define_method(name) { invalid? }
    end

    # Define success method
    #
    [:success?].each do |name|
      define_method(name) { valid? }
    end

    # are errors present?
    #
    # @return [Boolean] returns True / False
    #
    def errors_present?
      @error.present? ||
          @error_display_text.present? ||
          @error_data.present? ||
          @error_display_heading.present? ||
          @exception.present?
    end

    # Exception backtrace
    #
    # @return [String]
    #
    def exception_backtrace
      @e_b ||= @exception.present? ? @exception.backtrace : ''
    end

    # Get instance variables Hash style from object
    #
    def [](key)
        instance_variable_get("@#{key}")
    end

    # Error
    #
    # @return [Result::Base] returns object of Result::Base class
    #
    def self.error(params)
      new(params)
    end

    # Success
    #
    # @return [Result::Base] returns object of Result::Base class
    #
    def self.success(params)
      new(params.merge!(no_error))
    end

    # Exception
    #
    # @return [Result::Base] returns object of Result::Base class
    #
    def self.exception(e, params = {})
      obj = new(params)
      obj.set_exception(e)
      if params[:notify].present? ? params[:notify] : true
        send_notification_mail(e, params)
      end
      return obj
    end

    # Send Notification Email
    #
    def self.send_notification_mail(e, params)
      ApplicationMailer.notify(
          body: {exception: {message: e.message, backtrace: e.backtrace, error_data: @error_data}},
          data: params,
          subject: "#{params[:error]} : #{params[:error_display_text]}"
      ).deliver
    end

    # No Error
    #
    # @return [Hash] returns Hash
    #
    def self.no_error
      @n_err ||= {
          error: nil,
          error_display_text: nil,
          error_data: nil,
          error_display_heading: nil
      }
    end

    # Fields
    #
    # @return [Array] returns Array object
    #
    def self.fields
      error_fields + [:data]
    end

    # Error Fields
    #
    # @return [Array] returns Array object
    #
    def self.error_fields
      [
          :error,
          :error_display_text,
          :error_data,
          :error_display_heading
      ]
    end

    # To Hash
    #
    # @return [Hash] returns Hash object
    #
    def to_hash
      self.class.fields.each_with_object({}) do |key, hash|
        val = send(key)
        hash[key] = val if val.present?
      end
    end

    # is request for a non found resource
    #
    # @return [Result::Base] returns an object of Result::Base class
    #
    def is_entity_not_found_action?
      http_code == GlobalConstant::ErrorCode.not_found
    end


    # To JSON
    #
    def to_json
      hash = self.to_hash

      if (hash[:error] == nil)
        h = {
            success: true
        }.merge(hash)
        h
      else
        {
            success: false,
            err: {
                code: hash[:error],
                display_text: hash[:error_display_text] || 'Something went wrong.',
                display_heading: hash[:error_display_heading] || 'Error.',
                error_data: hash[:error_data] || {}
            },
            data: hash[:data] || {}
        }
      end

    end

  end

end
