module Mutations
    class Login < BaseMutation
        null true
        description "Sign in to Thnx"

        ## LOGIN
        argument :email, String, required: true
        argument :password, String, required: true

        field :user_id, Integer, null: true #Types::UserType
        field :token, String, null:true
        field :errors, [String], null: true

      def resolve(email:, password:)
        email.downcase!
        
        user = User.find_for_authentication(email: email)
        return {errors: ["Login failed, please check your credentials"]} if !user
        
        is_valid_for_auth = user.valid_for_authentication?{
          user.valid_password?(password)
        }
        if is_valid_for_auth
          user.last_sign_in_at = user.current_sign_in_at
          user.current_sign_in_at = Time.now.utc
          user.failed_attempts = 0
          user.locked_at = nil
          user.unlock_token = nil
          user.save
        end
        return is_valid_for_auth ? { user_id: user.id, token: user.token } : {errors: ["Login failed, please check your credentials"]}
      end

      def ready?(**args)
        true
      end

      def authorized?(**args)
        true
      end

    end
end