

require 'fcm'
class RedeemedGiftJob < ApplicationJob
    queue_as :default

    def perform(gift_id)

        gift = Gift.find(gift_id)
        if gift.present?
            if gift.sender_user.present? and gift.sender_user.notification_token.present?

                fcm = FCM.new(Rails.application.credentials.firebase_server_key)
                registration_ids= [gift.sender_user.notification_token] # an array of one or more client registration tokens

                # See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages for all available options.
                options = { "notification": {
                                "body": "Your thnx! to #{gift.recipient_user.first_name} has just powered up the Gratitude Economy.",
                                "data": {
                                    "event_type": "GIFT_REDEEMED", "gift_id": gift.id
                                  }
                            }
                }
                response = fcm.send(registration_ids, options)
            else
                # Send an email here if the user has logged out of the app or turned notifications off. I think the notification will clear.
                #GiftMailer.with(gift_id: gift_id).send_gift.deliver_now
            end
        end
    end

end
  

