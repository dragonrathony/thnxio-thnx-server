class AddMerchantToGift < ActiveRecord::Migration[5.2]
  def change
    add_column :gifts, :merchant_account_id, :integer
    add_foreign_key :gifts, :accounts, column: :merchant_account_id
  end
end
