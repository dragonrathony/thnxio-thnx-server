class AddContactMeToPromotionGift < ActiveRecord::Migration[5.2]
  def change
    add_column :promotion_gifts, :contact_me, :boolean
  end
end
