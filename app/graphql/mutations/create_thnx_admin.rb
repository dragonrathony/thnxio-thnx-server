module Mutations
    class CreateThnxAdmin < BaseMutation
        null true
        description "Assign thnx admin access"

        # input fields
        argument :email, String, required: true
        argument :firstName, String, required: true
        argument :lastName, String, required: false

        # response fields
        field :user, Types::UserType, null: true
        field :errors, [String], null: true
      
        def resolve(email:, first_name:, last_name:)
          account = context[:current_account]
          current_user = context[:current_user]
          
          password = Devise.friendly_token 
          password_confirmation = password 
          

          user = User.new(
            email: email, 
            password: password, 
            password_confirmation: password_confirmation, 
            first_name: first_name, 
            last_name: last_name
          )
          
          user.validate
          if user.valid? and account.present?

            # New user created make sure they reset their password
            user.reset_password
            user.skip_confirmation_notification!
            user.save!

            account_user = AccountUser.create(user_id: user.id, account_id: account.id)
            account_user.add_role :thnx_admin
            
            UserMailer.with(user_id: user.id).new_account_instructions.deliver_later # this should be deliver later
            {user: user}
          else
            {errors: user.errors.full_messages}
          end
        end
    end
end