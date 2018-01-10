module Util

  class CommonValidateAndSanitize

    # for integer array
    #
    # @return [Boolean] returns a boolean
    # modifies objects too
    #
    def self.integer_array!(objects)
      return false unless objects.is_a?(Array)

      objects.each_with_index do |o, i|
        return false unless CommonValidator.is_numeric?(o)

        objects[i] = o.to_i
      end

      return true
    end

  end

end
