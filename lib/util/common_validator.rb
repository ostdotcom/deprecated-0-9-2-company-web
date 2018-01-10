module Util

  class CommonValidator

    # Check for numeric-ness of an input
    #
    # @return [Boolean] returns a boolean
    #
    def self.is_numeric?(object)
      true if Float(object) rescue false
    end

    # front end sends 0 / 1 instead of boolean true / false
    # Check for booblean-ness of an input
    # check if '0' or '1' was passed
    #
    # @return [Boolean] returns a boolean
    #
    def self.is_boolean_string?(object)
      %w(0 1).include?(object.to_s)
    end

    # Is boolean
    #
    # @return [Boolean] returns a boolean
    #
    def self.is_boolean?(object)
      [
        true,
        false
      ].include?(object)
    end

    # Check for numeric-ness of multiple inputs
    #
    # @return [Boolean] returns a boolean
    #
    def self.are_numeric?(objects)
      return false unless objects.is_a?(Array)
      are_numeric = true
      objects.each do |object|
        unless self.is_numeric?(object)
          are_numeric = false
          break
        end
      end
      return are_numeric
    end

    # Is the given object Hash
    #
    # @return [Boolean] returns a boolean
    #
    def self.is_a_hash?(obj)
      obj.is_a?(Hash) || obj.is_a?(ActionController::Parameters)
    end

  end

end
