require 'phony'
module PhoneConcern
    extend ActiveSupport::Concern
  
    def internationalize_phone_number(number, country)
        c = ISO3166::Country.new(country)
        if c
          number = "#{c.country_code}#{number}" unless number.delete('+').starts_with?(c.country_code)
        end
        number = Phony.normalize(number)
        number
      end
  end