class AddFlagsToGift < ActiveRecord::Migration[5.2]
  def change
    add_column :gifts, :redeemed, :boolean
    add_column :gifts, :redeemed_at, :datetime
  end
end
