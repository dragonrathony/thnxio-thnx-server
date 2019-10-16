module Mutations
    class UpdateAddress < BaseMutation
        null true
        description "Create/Update Address"

        # input fields
        argument :id, ID, required: false
        argument :account_id, Integer, required: true
        argument :address1, String, required: true
        argument :address2, String, required: false
        argument :city, String, required: true
        argument :state, String, required: true
        argument :postcode, String, required: true
        argument :countryCode, String, required: true

        # response fields
        field :address, Types::AddressType, null: true
        field :errors, [String], null: true
      
        def resolve(id: nil, account_id:, address1:, address2: nil, city:, state:, postcode:, country_code:)
          #user = context[:current_user]
          address = Address.find(id) if id.present?
          address = Address.new(account_id:account_id, country_code: country_code) unless address.present?
          
          address.update_attributes(address1:address1, address2: address2, city:city, state:state, postcode:postcode)

           if address.save! 
            return {address: address}
           else
            return {errors: address.errors.full_messages}
           end
        end
    end
end