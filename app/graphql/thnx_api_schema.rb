require 'types/mutation_type'

class ThnxApiSchema < GraphQL::Schema

  mutation(Types::MutationType)
  query(Types::QueryType)

  def self.unauthorized_object(error)
    # Add a top-level error to the response instead of returning nil:
    raise GraphQL::ExecutionError, "An object of type #{error.type.graphql_name} was hidden due to permissions"
  end

  def self.unauthorized_field(error)
    # Add a top-level error to the response instead of returning nil:
    raise GraphQL::ExecutionError, "The field #{error.field.graphql_name} on an object of type #{error.type.graphql_name} was hidden due to permissions"
  end


end
ThnxApiSchema.graphql_definition