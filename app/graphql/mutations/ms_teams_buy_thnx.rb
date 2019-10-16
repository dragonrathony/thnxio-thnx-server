require 'stripe'

module Mutations
    class MSTeamsBuyThnx < BaseMutation
        null true
        description "MS Teams Buy Thnx"

        # input fields
        argument :quantity, Integer, required: true
        argument :token, String, required: true

        # response fields
        field :errors, [String], null: true
      
        def resolve(quantity:, token:)
          current_user = context[:current_user]

          # Ensure a user exists
          if !current_user.present?
            return {errors: "Failed to add permission"}
          end

          # Ensure the quantity is positive
          if quantity <= 0
            return {errors: "Quantity must be greater than 0"}
          end

          # The default price is $6
          defaultPrice = 600
          amount = quantity * defaultPrice

          # Ok now try and charge the user
          begin
            charge = Stripe::Charge.create({
              amount: amount,
              currency: "aud",
              source: token,
              description: "#{quantity} Thnx purchase"
            })

            payment = Payment.create!(user: current_user, amount: amount, tax: 0, total: amount, qty: quantity, gateway: "STRIPE", receipt: charge.id, status: charge.status, failure_code: charge.failure_code, failure_message: charge.failure_message)

            # Create the thnx credits for the user
            for i in 1..quantity
              thnx = Thnx.create!(owner_user_id: current_user.id, )
              PaymentItem.create!(payment: payment, thnx: thnx, price: defaultPrice)
            end

          rescue Stripe::CardError => e
            body = e.json_body
            err  = body[:error]
            receipt = err[:charge]
            status = err[:type]
            failure_code = err[:code]
            failure_message = err[:message]

            # Let's record the payment
            payment = Payment.create!(user: current_user, amount: amount, tax: 0, total: amount, qty: quantity, gateway: "STRIPE", receipt: receipt, status: status, failure_code: failure_code, failure_message: failure_message)
            
            return {errors: [err[:message]]}
          rescue => e
            return {errors: [e.message]}
          end

          return {errors: []}
        end
    end
end