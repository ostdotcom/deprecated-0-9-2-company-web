module Presenters

  module Web

    class Base

      # Init
      #
      # @param [Result::Base] data_obj (mandatory) - Page data
      # @param [Hash] params (optional) - Page params
      #
      # Set @response_obj - Object of Presenters::Response::Formatter::Base class
      # Set @params - params
      #
      # @return [Presenters::Web::Base] returns an object of Presenters::Web::Base class
      def initialize(data_obj, params = {})
        @response_obj = data_obj.data['formatted_response']
        @params = params
      end

    end

  end

end
