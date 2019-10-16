module Mutations
    class ResetPassword < BaseMutation
        null true
        description "Reset password"

        # input fields
        argument :password, String, required: true
        argument :passwordConfirmation, String, required: true
        argument :resetPasswordToken, String, required: true

        # response fields
        field :userId, Integer, null: true
        field :token, String, null: true
        field :errors, [String], null: true

        def resolve(password:, password_confirmation:, reset_password_token:)
          user = User.find_by(reset_password_token: reset_password_token)

           if user.present?
            user.confirm
            user.update_attributes!(password: password)
            return {user_id: user.id, token: user.token}
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