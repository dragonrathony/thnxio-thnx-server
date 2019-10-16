module Mutations
    class GiveThnx < BaseMutation
        null true
        description "Give thnx from User"

        # input fields
        argument :product_sku, String, required: true
        argument :name, String, required: true
        argument :email, String, required: true
        argument :mobile, String, required: true
        argument :message, String, required: true

        # response fields
        field :errors, [String], null: true
      
        def resolve(product_sku:, name:, email:, mobile:, message:)
          #user = User.find(2) # this should be @current_user
          #@current_user = user

          product = Product.find_by_sku(product_sku)
          recipient_user = User.where(email: email).or(User.where(mobile: mobile)).first
          
          if recipient_user.nil?
            password = Devise.friendly_token 
            password_confirmation = password 
            
            recipient_user = User.new(
              email: email, 
              password: password, 
              password_confirmation: password_confirmation, 
              first_name: name, 
              mobile: mobile
            )
          end

          gift = Gift.create!(sender_user: @current_user, recipient_user: recipient_user, product: product, message:message)
          
          # Check if the user has enough thnx
          if user.thnx.count <= product.qty
            #raise error
            return {errors: ["You do not have enough Thnx to share"]}
          end

          # Assign the thnx to the gift
         for i in 1..product.qty
            thnx = user.thnx.first
            if thnx.present?
              thnx.gifted = true unless recipient_user.present?   #mark as gifted if we dont know the user
              thnx.owner_user = recipient_user if recipient_user.present? #move thnx over if there is a known user
              thnx.save
              GiftItem.create(gift: gift, thnx: thnx)
            end
         end

          if user.present?
            {errors: []}
          else
            {errors: "Failed to add permission"}
          end
        end
    end
end