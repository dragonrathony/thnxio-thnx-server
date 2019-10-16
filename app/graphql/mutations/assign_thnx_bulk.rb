module Mutations
    class AssignThnxBulk < BaseMutation
        null true
        description "Assign thnx! to selected users"

        # input fields
        argument :user_ids, [Integer], required: true

        # response fields
        field :errors, [String], null: true
      
        def resolve(user_ids:)
          begin
            users = User.find(user_ids) 

            return {errors: ["Selected users do not exist"]} unless users.present? && users.length == user_ids.length

            account = context[:current_account]
            unassigned_thnx = account.unassigned_thnx
            thnx_per_user = unassigned_thnx.length / users.length

            thnx_idx = 0
            users.each do |user| 
              # Pick up account Thnx 
              for i in 1..thnx_per_user
                  thnx = unassigned_thnx[thnx_idx]
                  thnx.update_attributes!(owner_user_id: user.id)  if thnx.present? 
                  thnx_idx = thnx_idx + 1
              end
            end

            return {success: true}

          rescue Error => e
            return {errors: ["Failed to assign thnx"]}
          end
        end
    end
end