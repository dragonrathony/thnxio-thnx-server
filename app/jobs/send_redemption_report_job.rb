


# Sending report of which coffees have been redeemed in the past week

class SendRedemptionReportJob < ApplicationJob

    def perform()
        
        Merchant.all.each { |account|
            # set my email as the default unless it is production
            @email = 'lynda@thnx.io'
            @email = account.billing_email if Rails.env.production?

            @account_name = account.name
            @address = "#{account.addresses.first.address1} #{account.addresses.first.city} #{account.addresses.first.state} #{account.addresses.first.postcode}" if account.addresses.present?
            
            @start_date = DateTime.now.beginning_of_week
            @end_date = DateTime.now.end_of_week

            @items = Gift.joins(:product).where(merchant_account: account, redeemed_at: @start_date..@end_date)

            if @items.count > 0
                @big_thnx_count = @items.where("products.sku = ?", "BIGTHNX_COFFEE").count
                @little_thnx_count = @items.where("products.sku = ?", "SMALLTHNX_COFFEE").count

                unit_thnx_price = Setting.default_merchant_price
                unit_thnx_price = account.unit_thnx_price if account.unit_thnx_price.present?

                @big_thnx_total = @big_thnx_count * unit_thnx_price
                @little_thnx_total = @big_thnx_count * unit_thnx_price
                @total = @big_thnx_total + @little_thnx_total 

                resource = {
                    email: @email,
                    account_name:@account_name, 
                    address:@address,
                    start_date: @start_date, 
                    end_date: @end_date,
                    items: @items.all,
                    big_thnx_count: @big_thnx_count,
                    little_thnx_count: @little_thnx_count,
                    big_thnx_total: @big_thnx_total,
                    total: @total,
                    unit_thnx_price: @unit_thnx_price
                }

                MerchantMailer.send_payment_report(resource: resource).deliver_now
            end
        }
        return 

    end

end

