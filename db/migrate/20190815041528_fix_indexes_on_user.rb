class FixIndexesOnUser < ActiveRecord::Migration[5.2]
  def change
    remove_index :users, :email if index_exists?(:users, :email)

    add_index  :users, :email
  end
end
