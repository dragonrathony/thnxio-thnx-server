
require 'aba'
class MerchantController < ApplicationController
    def index
        merchants = Merchant.all.map do |merchant|
            {
                name: merchant.name,
                addresses: merchant.addresses.map do |address|
                    {
                        address1: address.address1,
                        address2: address.address2,
                        city: address.city,
                        state: address.state,
                        postcode: address.postcode,
                        latitude: address.latitude,
                        longitude: address.longitude
                    }
                end
            }
        end

        render json: {  merchants: merchants }
    end

    def export_aba

        return {errors: ["Access denied"]} unless @current_user.present? && @current_user.has_role?(:super_admin)
        
        batch_id = params[:batch_id]

        begin
            batch = RemittanceBatch.find(batch_id) if batch_id.present?
        rescue Exception => e
            return {errors: ["batch not valid"]} unless batch.present?
        end

        return {errors: ["batch not valid"]} unless batch.present?

        batch_items = batch.remittance_payments
        return {errors: ["batch contains no payments"]} if batch_items.count == 0

        # Initialise ABA
        aba = Aba.batch(
            bsb: "000-000", # Optional (Not required by NAB)
            financial_institution: "NAB",
            user_name: "Thnx Pty Ltd",
            user_id: "000000",
            description: "Thnx",
            process_at: Time.now.strftime("%d%m%y")
        )

        # Add transactions
        batch_items.each { |payment|
            #convert bsb to string
            bsb_i = payment.merchant_account.bsb.to_s.gsub(/[^0-9]/, "")
            bsb = "%s-%s" % [bsb_i[0..2], bsb_i[3..6]] # put bsb in the format 123-456
            puts bsb
            aba.add_transaction(
                {
                bsb: bsb,
                account_number: payment.merchant_account.account_no,
                amount: payment.total.to_i, # Amount in cents
                }
            )
        }
        if aba.valid?
            batch.update_attributes!(exported_at: Time.now.utc)
            send_data(aba.to_s, :type => 'text/csv; charset=utf-8; header=present', :filename => "dd_#{Time.now.to_i}.aba")  
        else
            puts aba.errors
            send_data(aba.errors.first, :type => 'text/plain; charset=utf-8; header=present', :filename => "error_#{Time.now.to_i}.aba")
        end
    end
end