class AddIndexesToGift < ActiveRecord::Migration[5.2]
  def change
    add_index(:gifts, [ :sender_user_id, :sender_deleted_at ])
    add_index(:gifts, [ :recipient_user_id, :recipient_deleted_at ])
    add_index(:gifts, [ :merchant_account_id, :redeemed, :redeemed_at ])
  end
end
