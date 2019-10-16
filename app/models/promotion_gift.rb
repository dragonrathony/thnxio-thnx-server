class PromotionGift < ApplicationRecord
    belongs_to :promotion
    belongs_to :promotion_account, :optional => true

    before_create :set_unique_code
    validates_presence_of :email_or_phone, uniqueness: { case_sensitive: false }
    validates :claim_token, uniqueness: { case_sensitive: false }

    def set_unique_code
     
        token = nil

        loop do
          # generate a code that we share with the user
          token = SecureRandom.base58(8)
          # run through our profanity list and make sure our code isn't profane
          break unless PromotionGift.where(claim_token: token).exists?
        end

        self.claim_token = token
    end
end
