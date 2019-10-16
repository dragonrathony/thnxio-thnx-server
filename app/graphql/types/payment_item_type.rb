module Types
    class PaymentItemType < BaseObject
      field :id, ID, null: false
      field :payment, Types::PaymentType, null: false
      field :thnx, Types::ThnxType, null: false
      field :price, Float, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    end
  end