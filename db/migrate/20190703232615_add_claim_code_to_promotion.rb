class AddClaimCodeToPromotion < ActiveRecord::Migration[5.2]
  def change
    add_column :promotions, :claim_code, :string
  end
end
