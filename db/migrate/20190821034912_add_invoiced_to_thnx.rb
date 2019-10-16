class AddInvoicedToThnx < ActiveRecord::Migration[5.2]
  def change
    add_column :thnxes, :remit_at, :datetime
    add_column :remittance_payments, :paid_at, :datetime
  end
end
