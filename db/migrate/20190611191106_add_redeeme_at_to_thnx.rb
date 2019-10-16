class AddRedeemeAtToThnx < ActiveRecord::Migration[5.2]
  def change
    add_column :thnxes, :redeemed_at, :datetime
  end
end
