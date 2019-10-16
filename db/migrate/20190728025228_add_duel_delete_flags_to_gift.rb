class AddDuelDeleteFlagsToGift < ActiveRecord::Migration[5.2]
  def change
    add_column :gifts, :sender_deleted_at, :datetime
    add_column :gifts, :recipient_deleted_at, :datetime
    remove_column :gifts, :deleted_at
  end
end
