class AddRemittanceBatch < ActiveRecord::Migration[5.2]
  def change
    create_table :remittance_batch do |t|
      t.datetime :start_processing_at
      t.datetime :complete_processing_at
      t.datetime :paid_at
      t.datetime :exported_at
      t.timestamps
    end
  end
end
