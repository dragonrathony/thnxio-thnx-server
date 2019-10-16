class Promotion < ApplicationRecord
    
    validates :code, :allow_blank => false, :allow_nil => false, uniqueness: { case_sensitive: false }
end
