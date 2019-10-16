class RenameInvoiceTables < ActiveRecord::Migration[5.2]
  def change
    rename_table :invoices, :remittance_payments
    rename_table :invoice_items, :remittance_payment_items
  end
end
