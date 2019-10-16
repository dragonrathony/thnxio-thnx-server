class AddColumnsToRemittanceBatch < ActiveRecord::Migration[5.2]
  def change
    add_column :remittance_batches, :line_item_count, :integer
    add_column :remittance_batches, :total, :decimal, :precision => 10, :scale => 2
  end
end
