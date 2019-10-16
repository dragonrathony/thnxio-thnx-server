class AddNameToAccounts < ActiveRecord::Migration[5.2]
  def change
    remove_column :accounts, :user_id
    add_column :accounts, :name, :string
  end
end
