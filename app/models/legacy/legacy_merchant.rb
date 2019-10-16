module Legacy
    class LegacyMerchant
        include ActiveModel::Validations
        include ActiveModel::Conversion
        extend ActiveModel::Naming
      
        attr_accessor :id, :code, :email,:name,:location,:credits_redeemed,:activated,:shopName
      
        def initialize(attributes = {})
          attributes.each do |name, value|
            send("#{name}=", value)
          end
        end

        def LegacyMerchant.build(current_user)
            access = AccountUser.where(user_id: current_user.id).pluck(:account_id)
            merchant = Merchant.where(id: access).first
            credits = Thnx.where(merchant_account_id: merchant.id).count if merchant.present?
            LegacyMerchant.new(id:merchant.id, code: merchant.code, email:current_user.email,name:current_user.first_name,location:"",credits_redeemed: credits,activated:merchant.active,shopName:merchant.name) if merchant.present?
        end

        
        def persisted?
          false
        end
    end
end