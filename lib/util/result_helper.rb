module Util

  module ResultHelper

    # Success
    #
    # @return [Result::Base] returns an object of Result::Base class
    #
    def success
      success_result({})
    end

    # Success with data
    #
    # @param [Hash] data (mandatory) - data to be sent in the response
    #
    # @return [Result::Base]
    #
    def success_result(data)
      # Allow only Hash data to pass ahead
      data = {} unless Util::CommonValidator.is_a_hash?(data)

      Result::Base.success({
                               data: data
                           })
    end

    # Error with Action
    #
    # @param [String] code (mandatory) - error code
    # @param [String] msg (mandatory) - error message
    # @param [String] display_heading (optional) - display heading
    # @param [String] display_text (mandatory) - error display text
    # @param [Hash] data (mandatory) - error data
    #
    # @return [Result::Base]
    #
    def error_result(code, display_text, display_heading = 'Error')
      Result::Base.error(
          {
              error: code,
              error_display_text: display_text,
              error_display_heading: display_heading
          }
      )
    end

    # Error with internal code
    #
    # @param [String] code (mandatory) - error code
    # @param [String] msg (mandatory) - error message
    # @param [Integer] internal_code (mandatory) - internal code, on which conditions can be made
    # @param [String] data (optional) - error data
    # @param [Hash] extended_data[:tracking_data] (optional) - tracking data to be sent in the response
    # @param [Hash] extended_data[:segmentation_data] (optional) - segmentation data to be sent in the response
    #
    # @return [Result::Base] returns an object of Result::Base class
    #
    def error_with_internal_code(code, msg, internal_code, data = {}, error_data = {}, error_display_text= '')

      Result::Base.error(
          {
              error: code,
              error_message: msg,
              error_display_text: error_display_text || msg,
              data: data,
              http_code: internal_code,
              error_data: error_data
          })
    end

    # Exception with internal code
    #
    # @param [Exception] e (mandatory) - Exception object
    # @param [String] code (mandatory) - error code
    # @param [String] msg (mandatory) - error message
    # @param [Integer] internal_code (mandatory) - internal code, on which conditions can be made
    # @param [String] data (optional) - error data
    #
    # @return [Result::Base] returns an object of Result::Base class
    #
    def exception_with_internal_code(e, code, msg, internal_code, data = {})

      Result::Base.exception(
          e, {
               error: code,
               error_message: msg,
               data: data,
               http_code: internal_code
           }
      )
    end


  end

end