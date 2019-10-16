class UpdateTypesOnMoneyFields < ActiveRecord::Migration[5.2]
  def change
    
    change_column :remittance_batches, :total, :decimal, :precision => 18, :scale => 4
    
    change_column :remittance_payments, :total, :decimal, :precision => 18, :scale => 4
    change_column :remittance_payments, :total_tax, :decimal, :precision => 18, :scale => 4
    change_column :remittance_payments, :total_amount, :decimal, :precision => 18, :scale => 4

    change_column :remittance_payment_items, :redemption_price, :decimal, :precision => 18, :scale => 4
  end
end
