module Mutations
    class RegisterUser < BaseMutation
        null true
        description "Create a new user"

        # input fields
        argument :email, String, required: true
        argument :password, String, required: false
        argument :passwordConfirmation, String, required: false
        argument :firstName, String, required: true
        argument :lastName, String, required: false
        argument :mobile, String, required: false

        # response fields
        field :token, String, null: true
        field :user_id, Integer, null: true
        field :errors, [String], null: true
      
        def resolve(email:, password: nil, password_confirmation: nil, first_name:, last_name: nil, mobile: nil)
          reset_required = password.nil?
          password = Devise.friendly_token if reset_required
          password_confirmation = password if reset_required
          
          @user = User.new(
            email: email, 
            password: password, 
            password_confirmation: password_confirmation, 
            first_name: first_name, 
            last_name: last_name,
            mobile: mobile
          )

          # Check if the user is valid
          if @user.valid?
            @user.save!

            if reset_required
              @user.send_reset_password_instructions
            end

            return {user_id: @user.id, token: @user.token}
          else
            errors = @user.errors.full_messages unless @user.valid?
            return {errors: errors}
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