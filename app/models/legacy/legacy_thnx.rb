module Legacy
    class LegacyThnx
        include ActiveModel::Validations
        include ActiveModel::Conversion
        extend ActiveModel::Naming          

        attr_accessor :little_thnx, :big_thnx, :total
      
        def initialize(attributes = {})
          attributes.each do |name, value|
            send("#{name}=", value)
          end
        end

        def LegacyThnx.build(merchant, dateTo, dateFrom)
            #.joins(:account_user).where("account_users.user_id = ?")
            
            merchant = Merchant.find(2)
            credits = Thnx.where(merchant_account_id: merchant.id).count
            LegacyMerchant.new(id:merchant.id, code:"", email:current_user.email,name:current_user.first_name,location:"",credits_redeemed: credits,activated:merchant.active,shopName:merchant.name)
        end
      
        def persisted?
          false
        end
    end
end