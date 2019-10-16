class PromotionAccount < ApplicationRecord
    
    belongs_to :promotion
    belongs_to :account
    validates :code, :allow_blank => false, :allow_nil => false, uniqueness: { case_sensitive: false }
end
