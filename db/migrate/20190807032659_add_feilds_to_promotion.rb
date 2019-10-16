class AddFeildsToPromotion < ActiveRecord::Migration[5.2]
  def change
    add_reference :promotions, :sender_user, index: true
    add_foreign_key :promotions, :users, column: :sender_user_id
    add_column :promotions, :message, :string
  end
end
