class PromotionGiftMailer < ApplicationMailer
    default from: 'events@thnx.io'

   
    def send_gift
            @email = params[:email]
            @code = params[:code]

            if @email.present?
                mail( to: @email, subject: "With thnx! From Di Bella and Sunrise", code: @code)
            
            else
                throw "Email did not send for gift #{gift_id}"    
            end
        end
 end