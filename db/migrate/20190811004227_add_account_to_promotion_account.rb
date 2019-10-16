class AddAccountToPromotionAccount < ActiveRecord::Migration[5.2]
  def change
    add_reference :promotion_accounts, :account, index: true
    remove_column :promotion_accounts, :address, :string
    remove_column :promotion_accounts, :longitude, :string
    remove_column :promotion_accounts, :latitude, :string
  end
end
