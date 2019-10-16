module Types
    class GiftType < BaseObject
      field :id, ID, null: false
      field :sender_user, Types::UserType, null: false
      field :recipient_user, Types::UserType, null: false
      field :product, Types::ProductType, null: false
      field :code, String, null: false
      field :email, String, null: false
      field :mobile, String, null: false
      field :name, String, null: false
      field :message, String, null: false
      field :opened, Boolean, null: false
      field :claimed, Boolean, null: false
      field :redeemed, Boolean, null: false
      field :sent_at, GraphQL::Types::ISO8601DateTime, null: false
      field :opened_at, GraphQL::Types::ISO8601DateTime, null: false
      field :claimed_at, GraphQL::Types::ISO8601DateTime, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
      field :redeemed_at, GraphQL::Types::ISO8601DateTime, null: false
    end
  end