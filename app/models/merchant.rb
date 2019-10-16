class Merchant < Account
    acts_as_paranoid

    validates :code, :allow_blank => true, :allow_nil => true, uniqueness: { case_sensitive: false }

    has_many :redeemed_gifts, -> { where :redeemed => true }, foreign_key: "merchant_account_id", class_name: "Thnx"
   
    validates :name, uniqueness: { case_sensitive: false }

    def primary_user

    end
    
    def last_7_days_activity  
      gifts_by_day = []
      [*0..6].reverse.each{ |day|
        gift_date = day.days.ago.beginning_of_day
        gift_day_total = self.redeemed_gifts.select { |gift| gift.redeemed_at.present? && gift.redeemed_at.to_date == gift_date}.length
        gifts_by_day << gift_day_total
      }
  
      gifts_by_day
    end

end
