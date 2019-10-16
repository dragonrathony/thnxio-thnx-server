

#require 'ruby-transmitsms'
require 'twilio-ruby'
require 'fcm'
class DeliverGiftJob < ApplicationJob
    queue_as :default

    def perform(gift_id)

        gift = Gift.find(gift_id)
        if gift.present? and gift.sent_at.nil?
            if gift.recipient_user.present? and gift.recipient_user.notification_token.present?
                puts "###### Deliver by Push notification ######"
                begin 
                    fcm = FCM.new(Rails.application.credentials.firebase_server_key)
                    registration_ids= [gift.recipient_user.notification_token] # an array of one or more client registration tokens

                    # See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages for all available options.
                    options = { "notification": {
                                    "title": "thnx! from #{gift.sender_user.first_name}",
                                    "body": "#{gift.message}",
                                    "data": {
                                        "event_type": "GIFT_RECEIVED", "gift_id": gift.id
                                      }
                                }
                    }
                    response = fcm.send(registration_ids, options)

                    # need to see what the result is and then if it is a successful response we need to update sent_at
                    if response.present? and response[:status_code] == 200
                        gift.update_attributes!(sent_at: Time.now.utc)
                    end
                rescue => e
                    gift.update_attributes!(sent_at: Time.now.utc, send_error: true, send_error_message: e.message)

                end
            else
                if gift.recipient_mobile.present?
                    account_sid = Rails.application.credentials.twilio_account_sid # Your Account SID from www.twilio.com/console
                    auth_token = Rails.application.credentials.twilio_auth_token   # Your Auth Token from www.twilio.com/console

                    begin
                        sender_phone = Rails.application.credentials.twilio_from_number
                        
                        @client = Twilio::REST::Client.new account_sid, auth_token
                        message = @client.messages.create(
                            body: "thnx! from #{gift.sender_user.first_name} \u2615 \n#{gift.message} \n\nYour thnx! code is #{gift.claim_token} \n\nDownload your thnx! app to claim. https://#{ENV['BASE_HOST']}/download-apps",
                            to: gift.recipient_mobile,    # Replace with your phone number
                            from: "thnx")  # Replace with your Twilio number

                        gift.update_attributes!(sent_at: Time.now.utc)

                    rescue Twilio::REST::TwilioError => e
                        gift.update_attributes!(sent_at: Time.now.utc, send_error: true, send_error_message: e.message)
                    end
                end

                if gift.recipient_email.present?
                    puts "###### Deliver by Email ######"
                    begin
                        GiftMailer.with(gift_id: gift_id).send_gift.deliver_now
                        gift.update_attributes!(sent_at: Time.now.utc)
                    rescue => e
                        gift.update_attributes!(sent_at: Time.now.utc, send_error: true, send_error_message: e.message)
                    end
                end
            end
        end
    end

end
  

