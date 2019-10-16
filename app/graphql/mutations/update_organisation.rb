module Mutations
    class UpdateOrganisation < BaseMutation
        null true
        description "Create/Update organisation"

        # input fields
        argument :id, ID, required: false
        argument :name, String, required: true
        argument :abn, String, required: false
        argument :active, Boolean, required: true
        argument :image, Types::FileType, required: false

        # response fields
        field :organisation, Types::AccountType, null: true
        field :errors, [String], null: true
      
        def resolve(id: nil, name:, abn: nil, country_code: nil, active:, image: nil)   
            account = Organisation.find(id) if id.present?
            account = Organisation.new(country_code: country_code) unless account.present?
            account.update_attributes(name: name, active: active, abn:abn)

            if image.present?
                account.update_attributes(image: image)
            end
                
           if account.save! 
            return {organisation: account}
           else
            return {errors: account.errors.full_messages}
           end
        end
    end
end