class RenameInvoiceIdOnRemittancePaymentItem < ActiveRecord::Migration[5.2]
  def change
    rename_column :remittance_payment_items, :invoice_id, :remittance_payment_id
  end
end
