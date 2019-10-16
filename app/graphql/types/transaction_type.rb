module Types
    class TransactionType < BaseObject
      field :id, ID, null: false
      field :thnx, Types::ThnxType, null: false
      field :user, Types::UserType, null: false
      field :type, String, null: false
    end
  end