module Mutations
    class UpdateUser < BaseMutation
        null true
        description "Update user record"

        # input fields
        argument :id, ID, required: true
        argument :email, String, required: true
        argument :firstName, String, required: true
        argument :lastName, String, required: false
        argument :mobile, String, required: false
        argument :password, String, required: false
        argument :passwordConfirmation, String, required: false

        # response fields
        field :user, Types::UserType, null: true
        field :errors, [String], null: true
      
        def resolve(id:, email:, first_name:, last_name:, mobile: nil,password: nil, password_confirmation: nil )
          @user = context[:current_user] if context[:pundit].authorize context[:current_user], :update?

          return {errors: ["User not found"]} unless @user.present?

          if password.present?
          @user.update_attributes(
              email: email, 
              password: password, 
              password_confirmation: password_confirmation, 
              first_name: first_name, 
              last_name: last_name,
              mobile: mobile
            )
          else
            @user.update_attributes(
              email: email, 
              first_name: first_name, 
              last_name: last_name,
              mobile: mobile
            )
          end
          @user.validate
           if @user.valid?
            @user.save! 
            return {user: @user}
           else
            return {errors: @user.errors.full_messages}
           end
        end
    end
end