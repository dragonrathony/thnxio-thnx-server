module Types
    class AccountUserType < BaseObject
      field :id, ID, null: false
      field :user, Types::UserType, null: false
      
    
    end
  end