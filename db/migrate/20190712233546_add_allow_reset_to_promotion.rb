class AddAllowResetToPromotion < ActiveRecord::Migration[5.2]
  def change
    add_column :promotions, :allow_reset, :boolean
  end
end
