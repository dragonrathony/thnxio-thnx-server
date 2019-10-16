class CreateAccountProduct < ActiveRecord::Migration[5.2]
  def change
    create_table :account_products do |t|
      t.references :account
      t.references :product
      t.decimal :price, precision: 10, scale: 2
      t.timestamps
    end
  end
end
