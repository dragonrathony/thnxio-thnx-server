class AddQtyToRemittancePayment < ActiveRecord::Migration[5.2]
  def change
    add_column :remittance_payments, :qty, :integer
  end
end
