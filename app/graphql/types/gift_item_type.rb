module Types
    class GiftItemType < BaseObject
      field :id, ID, null: false
      field :gift, Types::GiftType, null: false
      field :thnx, Types::ThnxType, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    end
  end