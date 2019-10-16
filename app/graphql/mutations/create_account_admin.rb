module Mutations
    class CreateAccountAdmin < BaseMutation
        null true
        description "Assign account admin access"

        # input fields
        argument :email, String, required: true
        argument :firstName, String, required: true
        argument :lastName, String, required: false

        # response fields
        field :user, Types::UserType, null: true
        field :errors, [String], null: true
      
        def resolve(email:, first_name:, last_name:)

          account = context[:current_account]
          
          password = Devise.friendly_token 
          password_confirmation = password 

          user = User.create!(
            email: email, 
            password: password, 
            password_confirmation: password_confirmation, 
            first_name: first_name, 
            last_name: last_name
          )

          # New user created make sure they reset their password
          user.send_reset_password_instructions

          if user.present? and account.present?
            account_user = AccountUser.create(user_id: user.id, account_id: account.id)
            account_user.add_role :account_admin
            
            {user: user}
          else
            {errors: "Failed to add permission"}
          end
        end
    end
end