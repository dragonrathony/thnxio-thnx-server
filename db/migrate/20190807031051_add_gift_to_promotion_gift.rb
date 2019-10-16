class AddGiftToPromotionGift < ActiveRecord::Migration[5.2]
  def change
    add_reference :promotion_gifts, :gift
  end
end
