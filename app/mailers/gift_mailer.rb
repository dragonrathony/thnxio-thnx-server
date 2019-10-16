class GiftMailer < ApplicationMailer

   
    def send_gift
        puts "GIFT MAILER"
        puts params.inspect
        if params[:gift_id].present?
            
            gift = Gift.find(params[:gift_id].to_i)

            @email = gift.recipient_email if gift.recipient_email.present?
            @name = gift.recipient_name
            @message = gift.message
            @sender_name = gift.sender_user.first_name
            @token = gift.claim_token
            if @email.present?
                mail(to: @email, subject: "You have received Thnx!", name: @name, sender_name: @sender_name, token: @token, message: @message)
            
            else
                throw "Email did not send for gift #{gift_id}"    
            end
        end
    end
 
 end