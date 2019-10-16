



class RemittanceBuildJob < ApplicationJob

    def perform()
        
        merchants = Merchant.all
        merchants.each { |merchant|
            unit_thnx_price = Setting.default_merchant_price
            unit_thnx_price = merchant.unit_thnx_price if merchant.unit_thnx_price.present?
            # are there thnxes to invoices to pay
            thnxes = Thnx.where("remit_at is null and merchant_account_id = ?", merchant.id)

            if thnxes.count > 0
                # when was last batch
                payment = RemittancePayment.find_by(merchant_account: merchant, remittance_batch_id: nil)
                payment = RemittancePayment.create!(merchant_account: merchant) unless payment.present?

                #mark it as being processed which locks it and cannot be added to a batch
                payment.update_attributes!(processing: true) 

                # add each invoice item
                thnxes.each { |item| 
                    RemittancePaymentItem.create!(remittance_payment_id: payment.id, unit_thnx_price: unit_thnx_price, thnx: item)
                    item.update_attributes!(remit_at: Time.now.utc)
                }

                items = RemittancePaymentItem.where(remittance_payment_id: payment.id)
                total = items.sum(:unit_thnx_price)

                taxes = 1 + ( Tax.find_by(country_code: merchant.country_code).tax_perc / 100)
                total_tax = total - (total / taxes)
                total_amount = total / taxes
                # create invoice total
                payment.update_attributes!(processing: false, total_amount: (total_amount*1000).round(2), total_tax: (total_tax*1000).round(2), total: (total*1000).round(2), qty: items.count)
            end
        }
        return 

    end

end

