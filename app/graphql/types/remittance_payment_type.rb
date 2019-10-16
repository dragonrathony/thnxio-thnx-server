module Types
    class RemittancePaymentType < BaseObject
      field :id, ID, null: false
      field :merchant_account, Types::AccountType, null: false
      field :remittance_batch, Types::RemittanceBatchType, null: true
      field :total_amount, Float, null: true
      field :total_tax, Float, null: true
      field :total, Float, null: true
      field :qty, Integer, null: true
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
      field :paid_at, GraphQL::Types::ISO8601DateTime, null: true
      field :processing, Boolean, null: false
    end
  end