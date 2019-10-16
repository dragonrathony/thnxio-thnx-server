module Mutations
    class ResetPasswordRequest < BaseMutation
        null true
        description "Reset password request"

        # input fields
        argument :email, String, required: true

        # response fields
        field :success, Boolean, null: true
        field :errors, [String], null: true
      
        def resolve(email:)
            user = User.where(email: email.downcase).first
           if user.present? 
            user.send_reset_password_instructions
            return {success: true}
           else
            return {errors: ["Password reset failed"]}
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