class RenameRemittanceBatchTables < ActiveRecord::Migration[5.2]
  def change
    rename_table :remittance_batch, :remittance_batches
  end
end
