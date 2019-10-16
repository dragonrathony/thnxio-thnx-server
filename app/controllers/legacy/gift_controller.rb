
  module Legacy

  class Legacy::GiftController < ApplicationController

    # @POST("gift/send")
    def send_gift
      gift = LegacyGift.new(params)
      gift = gift.create_gift @current_user
      if gift.present?
        DeliverGiftJob.perform_later gift.id
        render json: {success: "Gift giving worked"}
      else
        render json: {error: "Gift giving failed"}
      end
    end

    # @POST("gift/get_user")
    def get_user
      user = @current_user

      gifts = Gift.where(recipient_user_id: user.id, recipient_deleted_at: nil).order(updated_at: :desc)
      received_gifts = gifts.map {|gift|
        LegacyGift.build_gift(gift, "recieved")
      }

      gifts = Gift.where(sender_user_id: user.id, sender_deleted_at: nil).order(updated_at: :desc)
      sent_gifts = gifts.map {|gift|
        LegacyGift.build_gift(gift, "sent") # ios needs the gift type to display the data
      }

      error = nil

      render json: {sent_gift: sent_gifts, received_gift: received_gifts, error: error}

    end
    # @POST("/gift/redeem")
    def redeem
      merchant_code = params[:merchant_code]
      gift_id = params[:code]

      merchant = Merchant.find_by_code(merchant_code)

      if merchant.nil?
        render json: {error: "Invalid QR code scanned"}
        return
      end

      gift = Gift.find_by(claim_token: gift_id)

      promo_gift = PromotionGift.find_by(claim_token: gift_id)
      promo_accounts = PromotionAccount.where(account_id: merchant.id)
      valid_promo_gift = promo_gift.nil? || promo_accounts.count > 0

      unless valid_promo_gift
        render json: {error: "Cannot redeem this gift at this location"}
        return
      end

      if gift.present? and valid_promo_gift
        begin
          gift.gift_items.each {|item|
              thnx = item.thnx
              thnx.redeemed = true
              thnx.redeemed_at = Time.now.utc
              thnx.merchant_account = merchant
              thnx.save
          }

          gift.update_attributes!(merchant_account: merchant, redeemed: true, redeemed_at: Time.now.utc)

          RedeemedGiftJob.perform_later gift.id
        rescue => e
          puts e
          render json: {error: "Cannot claim gift. Please try again"}
          return
        end

        if gift.gift_items.count == 1
          gift_type = "LITTLE"
        else
          gift_type = "BIG"
        end

        render json: {success: "Gift redeemed successfully", merchant_name: merchant.name, redeemed_at: gift.redeemed_at, gift_type: gift_type, gift_credits: gift.gift_items.length}
      else
        render json: {error: "Gift not found"}
      end
    end
    #@POST("/gift/opened/{gift_id}")
    def opened
      gift_id = params[:gift_id]
      begin
        gift = Gift.find(gift_id)
        gift.update_attributes!(opened: true, opened_at: Time.now.utc)
      rescue => e
        puts e
        render json: {error: "Cannot update gift. Please try again"}
        return
      end
      render json: {gift_id: gift.id, success: "Gift opened successfully"}
    end

    # @POST("/gift/delete_gift/{gift_id}")
    def destroy
      gift_id = params[:gift_id]
      user = @current_user
      begin
        gift = Gift.find(gift_id)
        gift.sender_deleted_at = Time.now.utc if gift.sender_user.id == user.id
        gift.recipient_deleted_at = Time.now.utc if gift.recipient_user.id == user.id
        gift.save
      rescue => e
        puts e
        render json: {error: "Gift cannot be removed"}
      end

      render json: {success: "Gift removed successfully"}

    end

    # @GET("gift/link_account/{gift_id}")
    def link
      @token = params[:gift_id]

      # we already link the gift to an account on creation. The user is just not confirmed.
      # when the app calls link, we mark it as opened.
      gift = Gift.find_by_claim_token(@token)
      # check if it is a promo gift
      begin
        gift = check_promo_codes unless gift.present?
      rescue Exception => e
        render json: {error: e.message}
        return
      end

      if gift.present?

        if gift.recipient_user.nil?

          gift.update_attributes!(claimed: true, claimed_at: Time.now.utc, recipient_user: @current_user)

          gift.gift_items.each {|item|
            thnx = item.thnx
            # move thnx into users bucket.
            if !thnx.redeemed?
              thnx.owner_user_id = @current_user # push it back to the sender of the gift
              thnx.gifted = false
              thnx.save
            end
          }

          render json: {gift_id: gift.id.to_s, success: "Gift has been claimed", sender: gift.sender_user.first_name, message: gift.message}
        else
          render json: {error: "Gift has already been claimed"}
        end
      else
        render json: {error: "Oops. This doesn't appear to be a valid thnx! code. Please check you have no typos"}
      end
    end

    private

    def check_promo_codes
        # check count of gifts for a promotion against max available for promo
        promo_gift = PromotionGift.find_by(claim_token: @token)
        promo = Promotion.find(promo_gift.promotion_id) if promo_gift.present?
        gifts = PromotionGift.where(promotion_id: promo.id, gift_id: !nil)
        if gifts.length <= promo.available_thnx
          # pick up default user the thnx is from
          user = User.find(promo.sender_user_id) if promo.sender_user_id
          # pick the product
          product = Product.find_by_sku("SMALLTHNX_COFFEE")
          #check if there is a thnx available on the user
          thnx = user.thnx.first if user.present?
          if thnx.present? and user.present? and product.present?
            if promo_gift.email_or_phone.downcase == @current_user.email.downcase
              # create a real gift and assign it to the promotional gift.
              gift = Gift.create!(sender_user_id: user.id, claim_token: promo_gift.claim_token, expires_at: 2.weeks.from_now ,recipient_email: promo_gift.email_or_phone, product: product, message:promo.message)

              thnx.update_attributes!(owner_user_id: @current_user)
              GiftItem.create(gift: gift, thnx: thnx)
              promo_gift.update_attributes!(gift_id: gift.id)

              #render json: {gift_id: gift.id.to_s, success: "Gift has been claimed", sender: gift.sender_user.first_name, message: gift.message}
              return gift
            else
              #render json: {error: "Gift is not assigned to this user"}
              raise Exception.new("Gift is not assigned to this user");
            end
          else
            #render json: {error: "No thnx left for the #{promo.name} promotion"}
            raise Exception.new("No thnx left for the #{promo.name} promotion")
          end
        else
          #render json: {error: "No gifts left for the #{promo.name} promotion"}
          raise Exception.new("No gifts left for the #{promo.name} promotion")
        end
    end

  end
end