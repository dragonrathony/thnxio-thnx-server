module Legacy
    class LegacyGift
        include ActiveModel::Validations
        include ActiveModel::Conversion
        extend ActiveModel::Naming
      
        attr_accessor :id,
        :sender_id,
        :recipient_id,
        :code,
        :credits,
        :message,
        :created_time,
        :updated_time,
        :claimed,
        :claimed_time,
        :sent,
        :sent_time,
        :send_method,
        :opened,
        :opened_time,
        :revoked,
        :revoked_time,
        :sender_name,
        :sender_email,
        :sender_phone,
        :recipient_name,
        :recipient_email,
        :recipient_phone,
        :send_email,
        :url,
        :recipient_email_or_phone,
        :merchant_name,
        :recipient,
        :gift_type,
        :shop_name, :controller, :action, :gift

        def initialize(attributes = {})
          attributes.each do |name, value|
              send("#{name}=", value)
          end
        end

        def LegacyGift.build_gift(gift, gift_type)

          if gift.merchant_account.present?
            merchant_name = gift.merchant_account.name
          end

          claimed = "0"

          sent = "0"
          sent = "1" if gift.sent_at.present? 
          opened = "0"
          opened = "1" if gift.opened_at.present? 
          redeemed = "0"
          redeemed = "1" if gift.redeemed

          recipient_email = gift.recipient_email
          recipient_email = gift.recipient_user.email if gift.recipient_user.present?
          
          recipient_name = gift.recipient_name
          recipient_name = gift.recipient_user.first_name if gift.recipient_user.present?

          recipient_mobile = gift.recipient_mobile
          recipient_mobile = gift.recipient_user.mobile if gift.recipient_user.present?

          recipient_email_or_phone = recipient_email
          recipient_email_or_phone = recipient_mobile if recipient_mobile.present?

          LegacyGift.new(id: gift.id.to_s,
          sender_id: gift.sender_user_id.to_s,
          recipient_id:gift.recipient_user_id.to_s,
          code:gift.claim_token.to_s,
          credits: gift.gift_items.count.to_s,
          message:gift.message.to_s,
          created_time:gift.created_at,
          updated_time:gift.updated_at,
          claimed: redeemed,
          sent: sent,
          opened: opened,
          opened_time:gift.opened_at,
          revoked:"0",
          claimed_time:gift.redeemed_at,
          sent_time:gift.sent_at,
          revoked_time:nil,
          sender_name:gift.sender_user.first_name,
          sender_email:gift.sender_user.email,
          sender_phone:gift.sender_user.mobile,
          recipient_name: recipient_name,
          recipient_email: recipient_email,
          recipient_phone: recipient_mobile,
          recipient_email_or_phone: recipient_email_or_phone,
          gift_type: gift_type, #ios required field for Given and received screen
          # Are these used?
          #send_method:"email",
          #send_email:"4444",
          #url:"1234",
          merchant_name:merchant_name,
          shop_name:merchant_name)
        end

        def create_gift user

          product_sku = "SMALLTHNX_COFFEE"
          if gift_type == "BIG"
            product_sku = "BIGTHNX_COFFEE"
          end
          product = Product.find_by_sku(product_sku)

          recipient_user = User.where(email: recipient.downcase, confirmed: true).or(User.where(mobile: recipient, confirmed: true)).first
      
          email = recipient.scan(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i).first
          recipient_email = recipient if email.present? and recipient_email.nil?
          recipient_mobile = recipient_phone
          recipient_mobile = recipient if email.nil? and recipient_mobile.nil?

          # Check if the user has enough thnx
          if user.thnx.count < product.qty
            return false
          end

         gift = Gift.create!(sender_user: user, recipient_user: recipient_user, recipient_email: recipient_email, recipient_mobile:recipient_mobile, recipient_name:recipient_name, product: product, message:message)
        # if it auto adds a user then mark it as claimed.
         if recipient_user.present?
            gift.claimed = true
            gift.claimed_at = Time.now.utc
            gift.save
         end 
          # Assign the thnx to the gift
         for i in 1..product.qty
            thnx = user.thnx.first
            if thnx.present?
              thnx.gifted = true #unless recipient_user.present?   #mark as gifted if we dont know the user
              thnx.owner_user = recipient_user if recipient_user.present? #move thnx over if there is a known user
              thnx.save
              GiftItem.create(gift: gift, thnx: thnx)
            end
         end

          gift

        end
        
        def persisted?
          false
        end
    end
end