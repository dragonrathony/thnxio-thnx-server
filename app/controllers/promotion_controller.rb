

    
 
  class PromotionController < ApplicationController
    
    def temp_reset
      promo_code = params[:code]
      if promo_code.present? 
        # check if there is a promo code which has not been executed.
        promo = Promotion.where(code: promo_code).first

        if promo.present? and promo.allow_reset
          promo.update_attributes!(accepting_gifts: false, sent_gifts_at: nil) if promo.present?

          PromotionGift.where(promotion_id: promo.id).find_each do |gift|
            vouchures = Vouchure.where(gift_id: gift.id)
            vouchures.first.update_attributes!(gift_id: nil) if vouchures.count > 0
            gift.delete
          end
        end 
        render json: {}, status: 200
      else
        render json: {error: "Not a valid request"}
      end
    end

    def initialise
      promo_code = params[:code]
      if promo_code.present?
        # check if there is a promo code which has not been executed.
        promo = Promotion.where(code: promo_code, sent_gifts_at: nil).first
        if promo.present?
          # call email job
          # Pick up all PromotionGift for this promotion which have not been sent
          # send the email
          #PromotionGift.where(promotion_id: promo.id).find_each do |gift|
          #  PromotionGiftMailer.with(email: gift.email_or_phone, code: gift.claim_token).send_gift.deliver_now
          #end
          # flag as processed - as a promo should only run once
          #promo.update_attributes!(accepting_gifts: true, sent_gifts_at: Time.now.utc)
          render json: {}, status: 200
        else
          render json: {error: "Promotion does not exist or has expired"}
        end
      else
        render json: {error: "Not a valid request"}
      end
    end

    def show
      promo_code = params[:code]
      if promo_code.present?
        # check if there is a promo code
        promo = Promotion.where(code: promo_code).first
        if promo.present?
          render json: {promotion: promo}
        else
          render json: {error: "Promotion does not exist"}
        end
      else
        render json: {error: "Not a valid request"}
      end
    end
    def validate
      promo_code = params[:promo_code]
      email = params[:email]
      contact_me = params[:contact_me]
      promo_account_code = params[:promotion_account_code]

      # check if it within the promotion period
      if promo_code.present? #and promo_gift_code.present?
        promo = Promotion.find_by(code: promo_code)
        if promo.nil? 
          render json: {error: "Your gift has expired"} 
          return
        end

        if !promo.accepting_gifts? 
          render json: {error: "Your gift has expired"}
          return
        end

        #promo_account = PromotionAccount.where(code: promo_account_code, promotion_id: promo.id).first if promo.present?
        #if promo_account.nil?
        #  render json: {error: "Merchant does not exist"}
        #  return
        # end 

        promo_gift = PromotionGift.find_by(email_or_phone: email, promotion_id: promo.id)
        promo_gift = PromotionGift.create!( email_or_phone: email, contact_me: contact_me, promotion_id: promo.id, redeemed_at: Time.now.utc) unless promo_gift.present?

        # check if there is already a gift assigned to email and just return true.
        if promo_gift.gift_id.present?
          promo_gift.update_attributes!(contact_me: contact_me)
          render json: {merchant: nil, gift: promo_gift, vouchure: nil}, status: 200
        else
          gifts = PromotionGift.where(promotion_id: promo.id, gift_id: !nil)
          if gifts.length <= promo.available_thnx
            #email here
            PromotionGiftMailer.with(email: email, code:promo_gift.claim_token).send_gift.deliver_later
            render json: {merchant: nil, gift: promo_gift, vouchure: nil}, status: 200
          else
            render json: {error: "No gifts left"}
          end
        end
        #vouchure = Vouchure.find_by(gift_id: gift.id)
        #if vouchure.present?
        #  render json: {merchant: promo_account, gift: gift, vouchure: vouchure.vouchure}, status: 200
        #else
        #  vouchures = Vouchure.where(gift_id: nil)
        #  if vouchures.present? and vouchures.length > 0 
        #    vouchure = vouchures.first
        #    vouchure.update_attributes!(gift_id: gift.id)
        #    #TempGiftMailer.with(email: email, code: vouchure.vouchure).send_gift.deliver_later
        #    render json: {merchant: promo_account, gift: gift, vouchure: vouchure.vouchure}, status: 200
        ##  else
        #    render json: {error: "Gift has already been redeemed"}
        #  end
        #end
      else
        render json: {error: "Not a valid request"}
      end
    end

    private

    
  end
