class AddCodeToMerchant < ActiveRecord::Migration[5.2]
  def change
    add_column :accounts, :code, :string
  end
end
