module Mutations
    class BaseMutation < GraphQL::Schema::Mutation
        null false
        include Pundit

        def ready?(**args)
            puts args.inspect
            # Called with mutation args.
            # Use keyword args such as employee_id: or **args to collect them
            if context[:current_user].nil?
                return false, { errors: ["You don't have permission to do this"]}
            else
                # Return true to continue the mutation:
                return true
            end
        end
        
    end
end