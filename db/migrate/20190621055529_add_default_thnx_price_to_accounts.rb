class AddDefaultThnxPriceToAccounts < ActiveRecord::Migration[5.2]
  def change
    add_column :accounts, :unit_thnx_price, :float
  end
end
