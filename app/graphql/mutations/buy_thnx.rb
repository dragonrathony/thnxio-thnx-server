require 'stripe'

module Mutations
    class BuyThnx < BaseMutation
        null true
        description "Buy thnx, completing transaction from Stripe"

        # input fields
        argument :price, Float, required: true
        argument :quantity, Integer, required: true
        argument :token, String, required: true

        # response fields
        field :receipt, String, null: true
        field :errors, [String], null: true
      
        def resolve(price:, quantity:, token:)
            
            account = context[:current_account]

            defaultPrice = 5
            # override the unit price if one is set for the account.
            defaultPrice = account.unit_thnx_price if account.unit_thnx_price.present?

            throw "Price is invalid" if defaultPrice != price

            defaultPrice = (defaultPrice*100).to_i
            amount = quantity*defaultPrice
            tax = (amount*0.10).to_i
            total = (amount + tax)


            # call Stripe to complete the purchase
            # create charge with amount (in cents), currency, description, source (token)
            charge = Stripe::Charge.create({
                amount: total,
                currency: "aud",
                source: token,
                description: "#{quantity} Thnx purchase"
            })
            #TODO: idempotency key here

            # record the purchase
            payment = Payment.create!(user: context[:current_user], account: account, amount: amount, tax: tax, total: total, qty: quantity, gateway: "STRIPE", receipt: charge.id, status: charge.status, failure_code: charge.failure_code, failure_message: charge.failure_message)
            
            if charge.failure_code.present?
                return {errors: [charge.failure_message]}
            else
                # create and assign the thnx to the organisation
                for i in 1..quantity
                    thnx = Thnx.create!(account_id: context[:current_account].id, )
                    PaymentItem.create!(payment: payment, thnx:thnx, price: price)
                 end
                 return {receipt: charge.id}
            end
            
        end

    end
end