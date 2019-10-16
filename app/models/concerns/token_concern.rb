module TokenConcern
    extend ActiveSupport::Concern
  
    def get_unique_code(number)
      loop do
        token = SecureRandom.hex(10)
        break token unless Merchant.where(code: token).exists?
      end
    end

    def get_claim_token()

#this is incomplete
      loop do
        token = SecureRandom.hex(6)
        hashids = Hashids.new(token)
        self.claim_token = hashids.encode(12345)
        break token unless Gift.where(claim_token: token).exists?
      end
    end
  end