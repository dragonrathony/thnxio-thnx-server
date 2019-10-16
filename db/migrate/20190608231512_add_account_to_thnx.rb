class AddAccountToThnx < ActiveRecord::Migration[5.2]
  def change
    add_reference :thnxes, :account
  end
end
