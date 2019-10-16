module Mutations
    class AssignThnx < BaseMutation
        null true
        description "Give thnx from User"

        # input fields
        argument :user_id, Integer, required: true
        argument :qty, Integer, required: true

        # response fields
        field :user, Types::UserType, null: true
        field :errors, [String], null: true
      
        def resolve(user_id:, qty:)
          user = context[:pundit].policy_scope(User).find(user_id)
          account = context[:current_account]

          current_credits = user.organisation_thnx_credits
          difference = qty - current_credits
          
          # Check if the user has enough thnx
          if account.unassigned_thnx.count < difference
            return {errors: ["There is not enough Thnx"]}
          end

          # Assign the thnx to the gift
          if difference > 0
            for i in 1..difference
              thnx = context[:pundit].policy_scope(OrganisationThnx).where( owner_user_id: nil, status: "UNASSIGNED").first
                thnx.update_attributes!(owner_user_id: user_id)  if thnx.present? 
            end
          else difference < 0
            # remove thnx 
            for i in 1..(-1*difference)
              thnx = context[:pundit].policy_scope(OrganisationThnx).where(owner_user_id: user_id, status: "ACTIVE").first
                thnx.update_attributes!(owner_user_id: nil) if thnx.present? 
            end
          end

          user = User.find(user_id)
          if user.present?
            return {user: user}
          else
            return {errors: "Failed to add permission"}
          end
        end
    end
end