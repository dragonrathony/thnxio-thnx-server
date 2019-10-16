module Types
    class PaymentType < BaseObject
      field :id, ID, null: false
      field :user, Types::UserType, null: false
      field :account, Types::AccountType, null: false
      field :amount, Float, null: false
      field :tax, Float, null: false
      field :total, Float, null: false
      field :qty, Float, null: false
      field :receipt, String, null: false
      field :status, String, null: false
      field :failure_message, String, null: true
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    end
  end