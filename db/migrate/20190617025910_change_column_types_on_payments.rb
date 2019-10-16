class ChangeColumnTypesOnPayments < ActiveRecord::Migration[5.2]
  def change
    change_column :payments, :amount, :decimal, :precision => 10, :scale => 2
    change_column :payments, :total, :decimal, :precision => 10, :scale => 2
  end
end
