module Mutations
    class ConfirmAccount < BaseMutation
        null true
        description "Confirm Acccount"

        # input fields
        argument :email, String, required: true
        argument :confirmToken, String, required: true

        # response fields
        field :userId, Integer, null: true
        field :errors, [String], null: true
      
        def resolve(email:, confirm_token:)
          user = User.find_by(confirmation_token: confirm_token, email: email)
   
           if user.present?
            user.confirm
            return {user_id: user.id}
           else
            return {errors: ["Confirm account failed"]}
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