



class CalculateUserStatsJob < ApplicationJob

    def perform(gift)
        
        user = gift.sender_user
        user.update_attributes!(total_thnx_gifted: Gift.where(sender_user_id: user.id).count) if user.present?

        user = gift.recipient_user
        user.update_attributes!(total_thnx_received: Gift.where(recipient_user_id: user.id).count) if user.present?
        
    end

end

