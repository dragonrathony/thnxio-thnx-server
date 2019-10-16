module Mutations
    class CreateOrganisation < BaseMutation
        null true
        description "Create organisation"

        # input fields
        argument :name, String, required: true
        argument :email, String, required: true
        argument :password, String, required: true
        argument :passwordConfirmation, String, required: true
        argument :firstName, String, required: true
        argument :lastName, String, required: true

        # response fields
        field :token, String, null: true
        field :user_id, ID, null: true
        field :errors, [String], null: true
      
        def resolve(name:, first_name:,last_name:,email:, password:, password_confirmation:)
            
            ActsAsTenant.without_tenant do
                # Tenant checking is disabled for all code in this block
                account = Organisation.new(name: name, active: true, country_code: "AU")
                
                user = User.new(
                        email: email, 
                        password: password, 
                        password_confirmation: password_confirmation, 
                        first_name: first_name, 
                        last_name: last_name
                    )

                if account.valid? && user.valid?
                    account.save!
                    user.save!
                    
                    account_user = AccountUser.create!(user_id: user.id, account_id: account.id)
                    account_user.add_role :account_admin

                    return {account_id: account.id, user_id: user.id, token: user.token }
                    
                else
                    errors = user.errors.full_messages unless user.valid?
                    errors = account.errors.full_messages unless account.valid?
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