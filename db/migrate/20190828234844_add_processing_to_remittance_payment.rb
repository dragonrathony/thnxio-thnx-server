class AddProcessingToRemittancePayment < ActiveRecord::Migration[5.2]
  def change
    add_column :remittance_payments, :processing, :boolean
  end
end
