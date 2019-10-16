class Gift < ApplicationRecord
    include TokenConcern
    include PhoneConcern
    #acts_as_paranoid

    has_paper_trail :class_name => 'PaperTrail::GiftVersion'

    before_create :set_unique_code

    belongs_to :product
    belongs_to :sender_user, :class_name => "User"
    belongs_to :recipient_user, :class_name => "User", :optional => true
    belongs_to :merchant_account, :class_name => "Account", :optional => true

    has_many :gift_items

    validates :claim_token, uniqueness: { case_sensitive: false }

    def set_unique_code
        # Assume a country based on the information we have
        self.recipient_mobile = internationalize_phone_number(recipient_mobile, 'AU') if recipient_mobile.present? and recipient_mobile != "" # need to add country to users and pick up country
        
        token = nil

        loop do
          # generate a code that we share with the user
          token = SecureRandom.base58(8)
  
          # run through our profanity list and make sure our code isn't profane
          break unless Obscenity.profane?(token) or Gift.where(claim_token: token).exists?

          
        end

        # store an encrypted version of the key, which prevents manually inserting/updating gifts in the db
        salt  = Rails.application.credentials.claim_token_salt
        key   = ActiveSupport::KeyGenerator.new(Rails.application.credentials.secret_key_base).generate_key salt, 32
        crypt = ActiveSupport::MessageEncryptor.new key
        encrypted_data = crypt.encrypt_and_sign(token)

        # to decrypt:
        #salt  = Rails.application.credentials.claim_token_salt
        #key   = ActiveSupport::KeyGenerator.new(Rails.application.credentials.secret_key_base).generate_key salt, 32
        #crypt = ActiveSupport::MessageEncryptor.new key

        # we have a valid token
        self.claim_token = token if self.claim_token.nil?
        self.encrypted_claim_token = encrypted_data if self.claim_token.nil?

        # set an expiry time on the gift
        self.expires_at = 2.weeks.from_now

    end
    
end
