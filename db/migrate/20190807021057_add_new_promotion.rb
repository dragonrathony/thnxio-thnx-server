class AddNewPromotion < ActiveRecord::Migration[5.2]
  def change
    add_column :promotions, :available_thnx, :integer

  end
end
