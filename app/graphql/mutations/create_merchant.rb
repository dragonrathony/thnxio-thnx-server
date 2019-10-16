module Mutations
    class CreateMerchant < BaseMutation
        null true
        description "Create organisation"

        # input fields
        argument :id, ID, required: false
        argument :userId, Integer, required: false
        argument :addressId, Integer, required: false
        argument :name, String, required: true
        argument :email, String, required: true
        argument :password, String, required: false
        argument :passwordConfirmation, String, required: false
        argument :firstName, String, required: true
        argument :lastName, String, required: true
        argument :code, String, required: false
        argument :unitThnxPrice, String, required: false
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
        field :token, String, null: true
        field :user_id, ID, null: true
        field :account_id, ID, null: true
        field :errors, [String], null: true
      
        def resolve(id: nil, user_id: nil, address_id: nil, name:, first_name:,last_name:,email:, password: nil, password_confirmation: nil, code: nil, unit_thnx_price: nil, address1: nil, address2: nil, city: nil, state: nil, postcode: nil,latitude: nil, longitude: nil, abn: nil, bsb: nil, account_no: nil, primary_email: nil)
            
            ActsAsTenant.without_tenant do
                # Tenant checking is disabled for all code in this block
                account = Merchant.find(id) if id.present?

                if account.present?
                    account.update_attributes(name: name, unit_thnx_price: unit_thnx_price, code: code, bsb: bsb, abn: abn, account_no: account_no, primary_email: primary_email)
                else
                    account = Merchant.new(name: name, active: true, country_code: "AU", code: code, unit_thnx_price: unit_thnx_price, bsb: bsb, abn: abn, account_no: account_no, primary_email: primary_email) unless account.present?
                end
                
                user = User.find(user_id) if user_id.present?

                # temp fix to pick up a loose user and attch it to this account
                existing_user = User.find_by(email: email) unless user.present?
                if existing_user.present? && !AccountUser.exists?(user: existing_user)
                    user = existing_user
                end

                if user.present?
                    user.update_attributes(
                        email: email, 
                        first_name: first_name, 
                        last_name: last_name
                        )

                    user.update_attributes(
                        password: password,
                        password_confirmation: password_confirmation
                        ) if password.present?
                else
                    reset_password = password.nil? ? true : false

                    password = SecureRandom.hex(6) if password.nil?
                    password_confirmation = password if password_confirmation.nil?

                    user = User.new(
                        email: email, 
                        password: password, 
                        password_confirmation: password_confirmation, 
                        first_name: first_name, 
                        last_name: last_name
                    ) 

                    unless user.valid?
                        errors = user.errors.full_messages
                        return {errors: errors}
                    end

                    
                end

                if account.valid?
                    account.save!
                    user.save!
                    user.send_reset_password_instructions if reset_password

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

                    unless AccountUser.exists?(user: user, account: account)
                        account_user = AccountUser.create!(user_id: user.id, account_id: account.id)
                        account_user.add_role :merchant_admin
                    end

                    return {account_id: account.id, user_id: user.id, token: user.token }
                    
                else
                    errors = account.errors.full_messages
                    return {errors: errors}
                end

            end
        end

        def ready?(**args)
            true
        end

        def authorized?(**args)
            true
        end
    end
end