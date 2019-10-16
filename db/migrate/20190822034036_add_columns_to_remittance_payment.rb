class AddColumnsToRemittancePayment < ActiveRecord::Migration[5.2]
  def change
    add_reference :remittance_payments, :remittance_batch
  end
end
