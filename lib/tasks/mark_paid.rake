namespace :thnx do
    desc "Add thnx to a user - requires user_id, account_id and total_thnx"
    task :mark_paid => :environment  do 
        
        payment_data = [{account_id: 2, total: 17, unit_thnx_price: 3.5},
            {account_id: 4, total: 13, unit_thnx_price: 4},
            {account_id: 8, total: 1, unit_thnx_price: 3.8},
            {account_id: 3, total: 2, unit_thnx_price: 3.5},
            {account_id: 7, total: 41, unit_thnx_price: 3.4},
            {account_id: 14, total: 10, unit_thnx_price: 3.7}]

        batch = RemittanceBatch.create!(exported_at: '22 Aug 2019', paid_at:'22 Aug 2019')
        batch_total = 0
        payment_data.each { |data|
            merchant = Merchant.find(data[:account_id])


            payment = RemittancePayment.create!(merchant_account: merchant, remittance_batch: batch)
            unit_thnx_price = data[:unit_thnx_price]
            # add each invoice item
            for i in 1..data[:total].to_i
                thnx = Thnx.where("merchant_account_id = ? and redeemed = true and remit_at is null", data[:account_id]).order(:id).first
                RemittancePaymentItem.create!(remittance_payment_id: payment.id, unit_thnx_price: unit_thnx_price, thnx: thnx)
                thnx.update_attributes!(remit_at: '22 Aug 2019')
            
            end

            items = RemittancePaymentItem.where(remittance_payment_id: payment.id)
            total = items.sum(:unit_thnx_price)

            taxes = 1 + ( Tax.find_by(country_code: merchant.country_code).tax_perc / 100)
            total_tax = total - (total / taxes)
            total_amount = total / taxes

            batch_total = batch_total + total
            # create invoice total
            payment.update_attributes!(paid_at: '22 Aug 2019', processing: false, total_amount: (total_amount*1000).round(2), total_tax: (total_tax*1000).round(2), total: (total*1000).round(2), qty: items.count)

            
        }
        batch.update_attributes!(line_item_count: RemittancePayment.where(remittance_batch_id: batch.id).count, total: (batch_total*1000))
              
    end


  end