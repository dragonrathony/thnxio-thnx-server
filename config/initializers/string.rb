class String
    def number?
        Float(self).is_a?(Float)
    rescue ArgumentError, TypeError
      false
    end
  end