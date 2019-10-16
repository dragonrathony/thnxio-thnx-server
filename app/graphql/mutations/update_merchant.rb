module Mutations
    class UpdateMerchant < BaseMutation
        null true
        description "Create/Update Merchant"

        # input fields
        argument :id, ID, required: false
        argument :addressId, Integer, required: false
        argument :name, String, required: true
        argument :active, Boolean, required: true
        argument :address1, String, required: true
        argument :address2, String, required: false
        argument :city, String, required: true
        argument :state, String, required: true
        argument :postcode, String, required: true
        argument :latitude, String, required: false
        argument :longitude, String, required: false
        argument :abn, String, required: false
        argument :bsb, String, required: false
        argument :account_no, String, required: false
        argument :primary_email, String, required: false

        # response fields
        field :merchant, Types::AccountType, null: true
        field :errors, [String], null: true
      
        def resolve(id: nil, name:, active:, address_id: nil, address1: nil, address2: nil, city: nil, state: nil, postcode: nil,latitude: nil, longitude: nil, abn: nil, bsb: nil, account_no: nil, primary_email: nil)
          #user = context[:current_user]
          account = Merchant.find(id) if id.present?
          account = Merchant.new(country_code: country_code) unless account.present?
 
          account.update_attributes(name: name, bsb: bsb, abn: abn, account_no: account_no, active: true, primary_email:primary_email)

           if account.valid?
                account.save!

                if latitude.nil? || longitude.nil?
                    location = Geocoder.search("#{address1} #{city} #{state} #{postcode}").first
                    latitude = location.latitude if location.present?
                    longitude = location.longitude if location.present?
                end

                address = Address.find_by(account_id: id) if id.present?
                if address.present?
                    address.update_attributes(address1: address1, address2:address2, city: city, state: state, postcode: postcode, latitude: latitude, longitude:longitude)
                else
                    address = Address.new(account: account, country_code: "AU", address1: address1, address2:address2, city: city, state: state, postcode: postcode, latitude: latitude, longitude:longitude);
                end

                unless address.valid?
                    errors = address.errors.full_messages 
                    return {errors: errors}
                end
                
                address.save!
                
                return {merchant: account}
           else
                return {errors: account.errors.full_messages}
           end
        end
    end

    
end