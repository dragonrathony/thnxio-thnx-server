module Mutations
    class Logout < BaseMutation
        null true
        description "Log user out of Thnx"

      
        field :success, Boolean, null: true
        def resolve()
          if context[:current_user]
            context[:current_user].update(jti: SecureRandom.uuid)
          end 
          {success: true}
        end
    end
end