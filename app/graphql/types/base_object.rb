module Types
  class BaseObject < GraphQL::Schema::Object

    def self.authorized?(object, context)
      #@current_user = context[:current_user]
      # check auth on object
      #puts self.authorize object, :show? if object.present?
      super && (object.nil? || context[:current_user].present?)
    end

  end
end
