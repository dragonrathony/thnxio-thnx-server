module Mutations
    class RemoveAccountUsers < BaseMutation
        null true
        description "Remove Users from Account"

        # input fields
        argument :user_ids, [Integer], required: true

        # response fields
        field :errors, [String], null: true
      
        def resolve(user_ids:)
          begin
            users = User.find(user_ids) 

            return {errors: ["Selected users do not exist"]} unless users.present? && users.length == user_ids.length

            account = @current_account
            users.each { |user| 
              #Pick up account Thnx 
              thnxes = OrganisationThnx.where(owner_user_id: user.id, status: "ACTIVE")
              thnxes.each { |thnx|
                thnx.owner_user_id = nil
                thnx.save
              }
              account_access = AccountUser.where(user_id: user.id).first

              if account_access.present?
                AccountUser.destroy(account_access.id) 
              end
            }

            return {success: true}

          rescue Error => e
            return {errors: ["Failed to remove permission"]}
          end
        end
    end
end