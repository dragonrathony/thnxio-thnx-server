module Types
    class MerchantGiftType < BaseObject
      field :id, ID, null: false
      field :product, Types::ProductType, null: false
      field :redeemed, Boolean, null: false
      field :redeemed_at, GraphQL::Types::ISO8601DateTime, null: false
      field :remit_at, GraphQL::Types::ISO8601DateTime, null: false
      
    end
  end