class AddCountsToAccountUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :account_users, :total_thnx_received, :integer
    add_column :account_users, :total_thnx_gifted, :integer
  end
end
