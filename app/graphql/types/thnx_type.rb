module Types
    class ThnxType < BaseObject
      field :id, ID, null: false
      field :user, Types::UserType, null: false
      field :account, Types::AccountType, null: false
      field :status, String, null: false
      field :redeemed, Boolean, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
      field :redeemed_at, GraphQL::Types::ISO8601DateTime, null: true
    end
  end