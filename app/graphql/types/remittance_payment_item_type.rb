module Types
    class RemittancePaymentItemType < BaseObject
      field :id, ID, null: false
      field :thnx, Types::ThnxType, null: false
      field :unit_thnx_price, Float, null: false
    end
  end