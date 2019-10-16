class RenamePriceOnRemittancePaymentItem < ActiveRecord::Migration[5.2]
  def change
    rename_column :remittance_payment_items, :redemption_price, :unit_thnx_price
  end
end
