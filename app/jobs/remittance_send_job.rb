



class RemittanceSendJob < ApplicationJob
    def perform(params)
        remittance_payment_id = params[:remittance_payment_id]
        # set my email as the default unless it is production
        payment = RemittancePayment.find(remittance_payment_id)
        account = payment.merchant_account
        @email = 'lynda@thnx.io'
        @email = account.billing_email if Rails.env.production?
        @account_name = account.name
        @address = "#{account.addresses.first.address1} #{account.addresses.first.city} #{account.addresses.first.state} #{account.addresses.first.postcode}" if account.addresses.present?
    
        @items = payment.remittance_payment_items

        resource = {
            email: @email,
            account_name:@account_name, 
            address:@address,
            payment: payment,
            items: @items
        }
        MerchantMailer.send_payment_report(resource: resource).deliver_now

        return 

    end

end

