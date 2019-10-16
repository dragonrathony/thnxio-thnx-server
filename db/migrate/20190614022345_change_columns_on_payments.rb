class ChangeColumnsOnPayments < ActiveRecord::Migration[5.2]
  def change
    remove_column :payments, :product_id

    add_column :payments, :gateway, :string
    add_column :payments, :receipt, :string
    add_column :payments, :status, :string
    add_column :payments, :failure_code, :string
    add_column :payments, :failure_message, :string


  end
end
