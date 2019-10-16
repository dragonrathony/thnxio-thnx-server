module Mutations
    class MSTeamsSendThnx < BaseMutation
        null true
        description "MS Teams send thnx from User"

        # input fields
        argument :email, String, required: true
        argument :message, String, required: true

        # response fields
        field :errors, [String], null: true
      
        def resolve(email:, message:)
          product = Product.find_by_sku("SMALLTHNX_COFFEE")
          recipient_user = User.where(email: email).first
          current_user = context[:current_user]

          if !current_user.present?
            return {errors: "Failed to add permission"}
          end
          
          if recipient_user.nil?
            password = Devise.friendly_token 
            password_confirmation = password 
            
            recipient_user = User.create!(
              email: email, 
              first_name: email,
              password: password, 
              password_confirmation: password_confirmation
            )
          end

          gift = Gift.create!(sender_user: current_user, recipient_user: recipient_user, product: product, message: message)
          
          # Check if the user has enough thnx
          if current_user.thnx.count < product.qty
            #raise error
            return {errors: ["You do not have enough Thnx to share"]}
          end

          # Assign the thnx to the gift
         for i in 1..product.qty
            thnx = current_user.thnx.first
            if thnx.present?
              thnx.gifted = true unless recipient_user.present?   #mark as gifted if we dont know the user
              thnx.owner_user = recipient_user if recipient_user.present? #move thnx over if there is a known user
              thnx.save
              GiftItem.create(gift: gift, thnx: thnx)
            end
         end

          if current_user.present?
            {errors: []}
          else
            {errors: "Failed to add permission"}
          end
        end
    end
end